# ISSUE-010 — cli: Tailwind v3 migration rewrites the style to `nova` and targets a 404 registry URL

State: Submitted
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2932
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `resolveConfig` replaces legacy styles with `nova` before `checkDependencies` builds the TW3 registry URL, and `getRegistryUrl` then appends `/styles/<style>`, a path the TW3 site does not serve.

## Reach-and-Impact

Reach [S]: Every `add`, `update`, and `init` with an existing `components.json` in a Tailwind v3 + Svelte 5 project.
Impact [S]: `components.json` is persisted with `style: "nova"` and `registry: https://tw3.shadcn-svelte.com/registry/nova`; every later registry fetch targets a missing URL.
Impact [O]: `shadcn-svelte@1.7.0 add button` fails with a 404 for `tw3.shadcn-svelte.com/registry/nova/styles/nova/index.json` after rewriting `components.json`.

## Evidence

- [S] `packages/cli/src/utils/config/utils.ts:67-72` — styles outside `PRESET_STYLES` become `DEFAULT_PRESET_CONFIG.style`.
- [S] `packages/cli/src/utils/config/utils.ts:24-29` — `getConfig` always returns the resolved config, so `preconditions.ts:96` (`!config.style`) is unreachable.
- [S] `packages/cli/src/utils/preconditions.ts:98-99` — sets `registry = ${TW3_SITE_BASE_URL}/registry/${config.style}` and calls `writeConfig`.
- [S] `packages/cli/src/utils/registry/index.ts:19` — returns `url + /styles/${style}`.
- [O] `curl` 2026-10-20: `tw3.shadcn-svelte.com/registry/new-york/index.json` → 200; `…/registry/new-york/styles/new-york/index.json` → 404; `…/registry/nova/styles/nova/index.json` → 404.
- [S] `packages/cli/test/fixtures/legacy/README.md` — intended flow keeps the user's style and points to `tw3.shadcn-svelte.com/registry/<style>`.
- [O] `https://github.com/MikeeI/shadcn-svelte-repros/tree/main/tailwind-v3-legacy` → `pnpm dlx shadcn-svelte@1.7.0 add button` prints `Config file components.json updated`, then `Failed to fetch registry from https://tw3.shadcn-svelte.com/registry/nova/styles/nova/index.json: 404`; environment=Node 26.12.0, pnpm 10.34.7, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "tailwind v3 registry 404" and "legacy tailwind 3 components.json style nova"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — the CLI precondition and URL builder own the legacy route.
Routing: [S] shadcn-svelte-specific TW3 site and migration code.

## Proposed-Change

Read the raw style before `resolveConfig` coerces it, and build TW3 registry URLs without the `/styles/<style>` suffix.
If maintainers no longer support TW3 through the current CLI, replace the migration with an error that names the last TW3-compatible CLI version.

## Scope-and-Constraints

- Preserve: Tailwind v4 projects and the `next.shadcn-svelte.com` migration.
- Exclude: Tailwind v3 component content and TW3 site changes.
- Cost: [A] TW3 registry items may not match the current item schema; maintainers must choose fix or explicit deprecation.

## Verification

- TW3 + Svelte 5 fixture with `style: "new-york"` → `shadcn-svelte add button` → fetches `tw3.shadcn-svelte.com/registry/new-york/index.json`, keeps `style: "new-york"`.

## Publication-Blockers

None.

## Next-Action

Summary: Monitor issue response
Action: Answer maintainer questions on https://github.com/huntabyte/shadcn-svelte/issues/2932 with new evidence only.
Done-When: The issue is closed or a fix is merged, and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order, created with `gh issue create`; Severity `blocking all usage of shadcn-svelte`; disclosure is the final section.
Title: Tailwind v3 projects: `add` rewrites `components.json` to style `nova` and fetches a registry URL that 404s
Ledger note: `‹›` replace the published ASCII angle brackets because the ledger validator treats them as unfinished placeholders.

Body:

````markdown
### Describe the bug

In a Tailwind v3 + Svelte 5 project that still has a `components.json` from the Tailwind v3 era (`"style": "new-york"`), `shadcn-svelte add` fails with a 404 and rewrites `components.json` before failing:

- `resolveConfig` (`packages/cli/src/utils/config/utils.ts`) replaces the unsupported style with `nova` before `checkPreconditions` runs. The legacy branch in `preconditions.ts` then writes `"registry": "https://tw3.shadcn-svelte.com/registry/nova"` and `"style": "nova"` to `components.json`. Its `if (!config.style)` check can't be reached because the style is always set by then.
- `getRegistryUrl` then appends `/styles/nova`, so the CLI requests `https://tw3.shadcn-svelte.com/registry/nova/styles/nova/index.json`, which is a 404. The TW3 registry index is at `https://tw3.shadcn-svelte.com/registry/new-york/index.json` (200).

`packages/cli/test/fixtures/legacy/README.md` describes the intended flow as keeping the user's style and pointing the registry at `tw3.shadcn-svelte.com/registry/‹style›`.

**Possible fix:** read the style from the raw config before `resolveConfig` normalizes it, and don't append `/styles/‹style›` for the TW3 registry. If Tailwind v3 projects aren't supposed to work with the current CLI anymore, failing early with a message that names the last compatible CLI version would at least avoid rewriting `components.json`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/tailwind-v3-legacy

SvelteKit 2 + Svelte 5 + Tailwind CSS v3 with a TW3-era `components.json`:

```bash
pnpm install
pnpm dlx shadcn-svelte@latest add button
```

### Logs

```bash
◇  Config file components.json updated
└  CLI Error: Failed to fetch registry from https://tw3.shadcn-svelte.com/registry/nova/styles/nova/index.json: 404

# components.json afterwards
-	"style": "new-york",
-	"registry": "https://shadcn-svelte.com/registry"
+	"registry": "https://tw3.shadcn-svelte.com/registry/nova",
+	"style": "nova",
+	"iconLibrary": "lucide",
+	"menuColor": "default",
+	"menuAccent": "subtle"
```

### System Info

```bash
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
  CPU: (32) x64 AMD Ryzen 9 5950X 16-Core Processor
Binaries:
  Node: 26.12.0 - /usr/bin/node
  npm: 12.2.0 - /usr/bin/npm
  pnpm: 10.34.7 - /usr/bin/pnpm
npmPackages:
  @sveltejs/kit: 2.70.1 => 2.70.1
  svelte: ^5.55.7 => 5.57.2
  tailwindcss: ^3.4.17 => 3.4.19
shadcn-svelte CLI: 1.7.0 (via pnpm dlx)
```

### Severity

blocking all usage of shadcn-svelte

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
