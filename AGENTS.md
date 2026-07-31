# Repository Guidelines

## Project Overview

This is the shadcn-svelte monorepo. It contains the `shadcn-svelte` CLI, registry schemas, documentation site,
registry template, and reproduction fixtures. The CLI initializes projects and resolves, transforms, and installs
open-code Svelte components from registries.

## Architecture & Data Flow

- `packages/cli/src/index.ts` is the Commander entry point. It registers `add`, `apply`, `init`, `update`, and
  `registry` commands, enforces Node 20+, and handles termination signals.
- Command handlers converge on `packages/cli/src/utils/add-registry-items.ts`: fetch the registry index, resolve
  dependencies recursively, fetch and validate items, prompt for overwrites, transform files, write them, and merge
  CSS/dependency changes.
- `packages/cli/src/utils/registry/` owns network access, proxy handling, concurrent fetches, dependency resolution,
  and CLI-facing Zod schemas.
- `packages/cli/src/utils/config/` reads and validates `components.json`, synchronizes SvelteKit metadata, and resolves
  aliases from TypeScript configuration.
- `packages/cli/src/utils/transformers/` transforms imports, icons, menus, fonts, and optional TypeScript removal.
  Extend this pipeline rather than adding command-specific rewrites.
- `packages/registry/src/schemas.ts` owns the published registry-facing Zod schemas. Keep it distinct from the
  browser-safe, CLI-specific schemas under `packages/cli/src/utils/registry/`.
- The docs registry build scans `docs/src/lib/registry/`, invokes the built CLI, and writes generated registry JSON
  and metadata consumed by the site and downstream registries.

Keep command orchestration thin. Put reusable registry, configuration, transformation, and filesystem behavior in the
existing utility owners. There is no dependency-injection framework; tests isolate boundaries with module mocks and
`memfs`.

## Key Directories

- `packages/cli/src/`: CLI commands, configuration, registry access, transforms, and filesystem utilities.
- `packages/cli/test/`: Vitest unit tests and compatibility fixtures for CLI behavior.
- `packages/registry/src/`: published registry schemas and types.
- `docs/`: SvelteKit documentation site, registry source, content, and generation scripts.
- `docs/src/lib/registry/`: project-owned components, examples, blocks, hooks, utilities, and fonts.
- `registry-template/`: example custom-registry SvelteKit application and generated registry workflow.
- `repro/`: focused SvelteKit reproduction application; it is not the canonical component library.
- `.changeset/`: release metadata and Changesets configuration.

There is no root `src/` or `scripts/`; source is workspace-local, and build scripts live primarily in `docs/scripts/`.

## Development Commands

Run commands from the repository root unless noted:

```bash
pnpm dev                       # develop packages and docs concurrently
pnpm build                     # build the documentation site
pnpm build:cli                 # build workspace packages
pnpm build:registry-template   # build CLI, then registry-template output
pnpm check                     # check docs and packages
pnpm test                      # build registry template, then run CLI Vitest tests
pnpm lint                      # check Oxfmt formatting, then run ESLint
pnpm format                    # format with Oxfmt
pnpm preview                   # preview the docs site
```

Useful docs-package generators include `pnpm -F docs build:registry`, `build:icons`, `build:content`, and `build:llms`.
Generated registry output should be rebuilt through these scripts rather than edited directly. Build the CLI before
running docs registry generation because that generator invokes `packages/cli/dist/index.mjs`.

## Code Conventions & Common Patterns

- Use TypeScript and ES modules. `oxfmt.config.ts` specifies tabs, double quotes, 100-column code, ES5 trailing
  commas, sorted imports, and sorted Tailwind classes in `cn`, `clsx`, and `tv` calls.
- Prefix intentionally unused parameters or variables with `_`; ESLint otherwise reports unused TypeScript names.
- Validate untrusted configuration and registry data with the schema owned by that boundary. Do not conflate or
  duplicate the published registry schemas and CLI-specific schemas.
- Use `CLIError` or `ConfigError` and the existing `error(cause)`/`handleError` path for CLI failures. Do not swallow
  failures or introduce a parallel error-reporting convention.
- Prefer async functions and `Promise.all` for independent registry fetches. Preserve explicit command-level error
  handling and process-exit behavior.
- Svelte code uses Svelte 5 runes and snippets: `$props`, `$state`, `$derived`, and `{@render ...}`. Do not introduce
  legacy Svelte 4 `asChild` or builder patterns.
- Standard UI modules use `ui/<kebab-case>/index.ts`. Single-root modules use named exports; multipart components
  expose aliases such as `Card.Root`.
- When a snippet renders an interactive child, spread its supplied props so events, focus, and accessibility survive.
- Styling uses Tailwind CSS v4, `tailwind-variants`, `cn`, and theme CSS variables. Reuse tokens instead of hard-coded
  colors, and preserve the configured dark-mode variant.
- Global CSS is imported once from the root `+layout.svelte`; layouts render children with `{@render children()}`.

## Important Files

- `package.json`: root scripts, Node/pnpm requirements, and workspace orchestration.
- `pnpm-workspace.yaml`: workspace membership and shared dependency catalog.
- `packages/cli/src/index.ts`: CLI entry point and command registration.
- `packages/cli/src/utils/add-registry-items.ts`: central component-installation pipeline.
- `packages/cli/src/utils/registry/`: registry fetching, resolution, validation, and CLI schemas.
- `packages/cli/src/utils/config/`: `components.json` schema and alias resolution.
- `packages/registry/src/schemas.ts`: published registry schemas.
- `docs/scripts/build-registry.ts`: documentation registry generation.
- `eslint.config.js`: JavaScript, TypeScript, and Svelte lint rules.
- `oxfmt.config.ts`: authoritative formatter and import/Tailwind sorting rules.
- `.changeset/config.json`: public-package release policy targeting `main`.

## Runtime/Tooling Preferences

- Use pnpm, not Bun, npm, or Yarn. `package.json` pins `pnpm@10.32.1`, and `preinstall` enforces pnpm.
- Use Node.js 20 or newer; `.nvmrc` pins `v22.15.0`, and `.npmrc` enables strict engine checks.
- The pnpm workspace contains `packages/*`, `docs`, and `registry-template`.
- Oxfmt is the active formatter. Although `.prettierrc` remains present, workspace editor settings disable Prettier.
- Use repository scripts instead of invoking SvelteKit, Vite, ESLint, Vitest, or generators through ad hoc wrappers.
- Do not edit build, `.svelte-kit`, `dist`, generated registry, or generated docs outputs by hand.

## Testing & QA

- Tests use Vitest and live under `packages/cli/test/` as `*.test.ts`; there is no browser or component-test suite.
- Tests are Node-oriented unit tests. They commonly mock modules and prompts, use `memfs` for filesystem behavior,
  and compare transforms or generated registry data with assertions and inline snapshots.
- Shared fixtures cover full, partial, invalid, and legacy configurations; package-manager detection; colors; and
  Svelte/Tailwind compatibility. Reuse these fixtures instead of inventing one-off setup.
- Run focused CLI tests with `pnpm -F shadcn-svelte test`. The root `pnpm test` is the standard CLI test path and
  first rebuilds the registry template; it does not run every workspace package's tests.
- Root `pnpm check` covers `docs` and `packages/*`, not `registry-template` or `repro`.
- Review inline snapshot changes manually, especially registry JSON and CSS transformer output.
- No coverage threshold or coverage command is configured. Do not claim coverage guarantees from test count alone.
- Before submitting, use the narrowest relevant check; use `pnpm check` for Svelte/TypeScript contracts and
  `pnpm lint` for formatting plus lint validation.
