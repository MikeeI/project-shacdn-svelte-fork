import { Context } from "runed";
import { z } from "zod";

export const USER_CONFIG_COOKIE_NAME = "scn_user_config";

const layoutSchema = z.enum(["fixed", "full"]).default("full");
const installationTypeSchema = z.enum(["cli", "manual"]).default("cli");
const packageManagerSchema = z.enum(["npm", "yarn", "pnpm", "bun"]).default("pnpm");
const colorFormatSchema = z.enum(["class", "hex", "rgb", "hsl", "oklch", "var"]).default("oklch");
// "default" means no theme override; any other value is a theme name from `$lib/registry/themes`.
const activeTheme = z.string().default("default");

export type Layout = z.infer<typeof layoutSchema>;
export type InstallationType = z.infer<typeof installationTypeSchema>;
export type PackageManager = z.infer<typeof packageManagerSchema>;
export type ColorFormat = z.infer<typeof colorFormatSchema>;
export type ActiveTheme = z.infer<typeof activeTheme>;

export const userConfigSchema = z
	.object({
		layout: layoutSchema,
		installationType: installationTypeSchema,
		packageManager: packageManagerSchema,
		colorFormat: colorFormatSchema,
		activeTheme: activeTheme,
	})
	.default({
		layout: "full",
		installationType: "cli",
		packageManager: "npm",
		colorFormat: "hsl",
		activeTheme: "default",
	});

export type UserConfigType = z.infer<typeof userConfigSchema>;

export function parseUserConfigValue(value: unknown): UserConfigType {
	const parsed = userConfigSchema.safeParse(value);
	if (parsed.success) return parsed.data;

	return userConfigSchema.parse({});
}

export function parseUserConfigJson(value: string | undefined): UserConfigType {
	if (!value) return parseUserConfigValue({});

	try {
		return parseUserConfigValue(JSON.parse(value));
	} catch {
		return parseUserConfigValue({});
	}
}

// Read only our cookie: `document.cookie` also carries cookies set by anything else on the
// origin, and a malformed percent-escape in one of those must not fail every page load.
function readCookie(cookie: string, name: string): string | undefined {
	for (const part of cookie.split(";")) {
		const separator = part.indexOf("=");
		if (separator === -1 || part.slice(0, separator).trim() !== name) continue;
		try {
			return decodeURIComponent(part.slice(separator + 1));
		} catch {
			return undefined;
		}
	}
	return undefined;
}

export function parseUserConfig(cookie: string): UserConfigType {
	return parseUserConfigJson(readCookie(cookie, USER_CONFIG_COOKIE_NAME));
}

export class UserConfig {
	#config: UserConfigType;

	constructor(config: UserConfigType) {
		this.#config = $state.raw(config);
	}

	get current(): UserConfigType {
		return this.#config;
	}

	setConfig(config: Partial<UserConfigType>): void {
		this.#config = { ...this.#config, ...config };
		document.cookie = `${USER_CONFIG_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(this.#config))}; path=/; max-age=31536000; SameSite=Lax;`;

		if (config.layout) updateLayoutClass(this.#config.layout);
	}
}

function updateLayoutClass(newLayout: Layout): void {
	if (typeof document === "undefined") return;

	// Remove any existing layout classes
	document.documentElement.classList.remove("layout-fixed", "layout-full");
	// Add the new layout class
	document.documentElement.classList.add(`layout-${newLayout}`);
}

export const UserConfigContext = new Context<UserConfig>("UserConfigContext");
