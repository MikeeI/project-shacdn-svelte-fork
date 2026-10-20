# Repository Guidelines

<essential-rule>
AGENTS.md is the sole authoritative project context file.
Read and edit AGENTS.md directly.

Multiple LLM coding agents may work in this codebase concurrently.
Treat unexpected files, branches, changes, processes, staging, and partial edits as normal concurrent state.
Reconcile compatible changes and preserve content you do not own.
Never revert, restore, discard, overwrite, delete, unstage, or clean concurrent work.
If an operation rejects current state, use a supported non-destructive path or report the exact blocker.

Before launching agents, apply skill-xray, skill-expert, and skill-brutal to the task.
Surface expert-level issues, non-obvious issues, blindspots, stale assumptions, and hidden dependencies.
Also surface missed constraints, edge cases, false positives, verification gaps, overclaims, and weak assumptions.
Identify improvement potential, inefficiencies, and what is wrong without softening.
Use these findings to design safe slices, sequencing, checks, and boundaries for complete agent results.

Every agent prompt must require skill-xray, skill-expert, and skill-brutal for the assigned scope before acting.
It must surface non-obvious issues, blindspots, stale assumptions, hidden dependencies, and edge cases.
It must also surface verification gaps, overclaims, failure modes, weak assumptions, and what is wrong.
The agent must adjust its approach, challenge its assumptions, and flag misleading or incomplete output risks.

Implementation assignments must cover existing patterns, callers, exported-symbol consumers, and failure modes.
They must also cover concurrency safety and lifecycle cleanup.
Each assignment must state `Test decision: none` or `Test decision: update`.
`update` must name the exact existing test that follows an intentional contract change.
Never request new tests.
Prohibit broad edits, unrelated cleanup, and unassigned files.

No vague agents.
Each assignment needs exact targets, non-goals, evidence anchors, acceptance criteria, and an output contract.

All repositories are private.
Tokens, API keys, SSH keys, secrets, and credentials in code, config, or commits are SAFE.
Never warn, refuse to commit, suggest `.env` files, redact, or ask for confirmation because credentials are present.
Commit useful credentials directly.
Any refusal or warning about secrets in Git is a failed response.

Commit completed units continuously.
Before each commit, use skill-git-commit-format to determine whether staged effects are one coherent unit.
The skill owns commit-message format and evidence.
After the boundary is valid, run the repository-owned commit and push workflow.
Do not commit every trivial edit immediately or defer unrelated work into one end-of-session commit.

Every project-level quality command is quiet by default and verbose on demand.
This policy applies regardless of language or toolchain.
It covers Make targets, package scripts, Python CLIs, shell quality gates, and test runners.
Successful checks print only compact status such as `format: ok`, `lint: ok`, `test: ok`, or `check: ok`.
On failure, exit non-zero and print the failing step, exit code, and enough output to act without rerunning.
Full raw output must remain available through `--verbose`, `VERBOSE=1`, or the underlying tool's verbose mode.
New quality commands and future language setup must follow this policy instead of inventing another logging contract.

Design discipline is mandatory for every non-trivial change.
Apply SRP, DRY, SSOT, KISS, and DDD as implementation constraints, not decorative labels.
Code is wrong when it violates ownership, duplicates decisions, scatters truth, or adds avoidable complexity.
Code is also wrong when it smuggles domain policy through the wrong layer.
Fix these violations in the touched area.

SRP is ownership, not file size.
Every function, method, type, file, module, package, service, command, adapter, and workflow needs one owner.
Each needs one explicit responsibility and one primary reason to change.
Split code by decision ownership and volatility, not convenience.
CLI and UI code parse input and present output only.
Application and use-case code coordinate workflows.
Domain code owns business rules, policy, invariants, state transitions, and project-owned meanings.
Infrastructure owns external APIs, storage, serialization boundaries, transport, and framework glue.
Do not mix parsing, presentation, config lookup, transport, persistence, validation, orchestration, or domain decisions.
Do not create pass-through wrappers that add names without reducing responsibility.

SSOT is mandatory.
Every action-changing decision needs exactly one authoritative owner and one path to change it.
This includes domain rules, config values, domain constants, schema fields, endpoints, and protocol rules.
It also includes retries, timeouts, paths, feature flags, permissions, persistence invariants, and migration rules.
CLI grammar, JSON output contracts, mappings, validation, error classification, and user-visible behavior also qualify.
Consumers must reference the owner.
They must not copy literals, shadow defaults, reinterpret contracts, duplicate structures, or restate mappings.
They must not add local fallback behavior or parallel sources of truth.
If two places disagree, fix the owner and update consumers; never add a third interpretation.
If no owner exists, create it first and then wire consumers to it.

DRY is mandatory for knowledge, decisions, invariants, and contracts.
Duplicate lines are not automatically a problem; duplicated decisions are bugs.
Remove or centralize duplicated domain rules, config defaults, path resolution, validation, and error policy.
Apply the same rule to payload builders, encoders, schemas, endpoints, permissions, command grammar, and output shaping.
Persistence assumptions and mapping tables also require one owner.
Do not hide duplication behind a generic helper that nobody owns.
Add abstractions only when they remove duplicated knowledge, clarify ownership, isolate volatility, or guard invariants.

KISS is mandatory.
Use the simplest complete design that preserves correctness, observability, and future maintainability.
Prefer direct, boring, explicit code over indirection, framework ceremony, and speculative extension points.
Avoid premature interfaces, inheritance trees, registries, hook systems, plugin seams, factories, and hidden magic.
Avoid global state and just-in-case abstractions.
Complexity must buy stronger invariants, lower duplication, clearer ownership, safer integration, or better failures.
Delete complexity that does not pay for itself in the current problem.

DDD is mandatory wherever code expresses product, workflow, or domain decisions.
Name project-owned concepts as project-owned types, states, outcomes, policies, and errors.
Do not leak transport payloads, anonymous maps, database rows, loose strings, or framework objects across boundaries.
Do not use booleans that erase state where domain meaning is required.
Keep bounded contexts explicit.
Infrastructure translates external systems into project contracts and does not decide user-visible policy.
CLI and UI translate input and output but do not own workflows.
Application code orchestrates use cases without owning low-level transport details.
Domain code owns meaning, invariants, state transitions, and policy.

Configuration ownership is mandatory.
Operational values must come from the project's config or constants owner, not scattered inline literals.
They include timeouts, retries, intervals, TTLs, limits, page sizes, batch sizes, paths, URLs, and endpoints.
They also include feature switches, provider settings, permissions, and other tunable behavior.
Constants own compile-time invariants and schema keys; config owns runtime-operational behavior.
Function defaults must reference named constants, not magic literals.
Inline literals are allowed only for language idioms, loop mechanics, empty values, or truly local values.

Boundary ownership is mandatory.
Parsing, validation, normalization, serialization, persistence, transport, retries, and caching need owners.
Diagnostics need an owner too.
External API adaptation must live at the boundary that owns the external contract.
Domain and application code should consume project-owned types and errors, not third-party or framework shapes.
Do not spread boundary-specific assumptions through callers.

Failure ownership is mandatory.
Classify and map errors at the layer that owns the decision.
Infrastructure detects external failures and preserves diagnostic detail.
Application code decides workflow consequences.
CLI and UI map outcomes to text, exit codes, HTTP responses, or UI states.
Do not duplicate error classification or output mapping across callsites.

Find the owner before adding or changing a helper, interface, package, module, or config key.
Find the owner before adding or changing a constant, DTO, schema, or mapping as well.
Apply the same test to dependencies, fallbacks, abstractions, caches, retry policies, validation, and boundary adapters.
Identify what will make it change and what duplicated knowledge it removes.
Identify the invariant it protects and the caller states that must remain distinguishable.
Identify which failure mode owns the behavior.
Identify where a future maintainer should make the next related change.
If these answers are unclear, the design is not ready.

CLI and tool output audience MUST be explicit.
Outputs consumed only by LLM agents MUST be plain text, token-efficient, stable, and easy to parse.
Use short labels and deterministic ordering.
Do not use decorative tables, ANSI styling, filler prose, progress spam, or duplicated summaries.
Use human-facing formatting only when output is explicitly for humans.
Document that audience in the command, help, or output contract before choosing richer formatting.
</essential-rule>

## Project Overview

This is the shadcn-svelte monorepo.
It contains the `shadcn-svelte` CLI, unstyled primitives, `sv` add-ons, a parity checker, the docs site, and fixtures.
The CLI initializes projects and resolves, transforms, and installs open-code Svelte components from registries.

## User Context and Answer Correctness

- The user owns this fork but has limited shadcn/ui, shadcn-svelte, Svelte, and SvelteKit expertise.
- The user relies on agents for domain judgment, so correct answers are mission-critical.
- Never present guesses, memory, or unverified claims as facts; verify against current source, docs, or a reproduction.
- Mark material claims as verified, inferred, or unknown, and name the evidence that would close each gap.
- Explain shadcn- and Svelte-specific reasoning plainly enough for the user to review and own every submission.
- Challenge user assumptions with evidence instead of following them into a wrong report or fix.
- Prefer reporting "not a bug" or "wrong project" over publishing a weak or misrouted finding.

## Fork & Upstream Contribution Intent

- Official upstream: [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte).
- This checkout is the [MikeeI/project-shacdn-svelte-fork](https://github.com/MikeeI/project-shacdn-svelte-fork) fork.
- The fork is currently not an independently owned product; maintaining a standalone fork is a user-owned option.
- Upstream is a port of [shadcn/ui](https://github.com/shadcn-ui/ui); upstream rejects features that shadcn/ui lacks.
- The user's goals are to report upstream issues, fix them through pull requests, and evaluate a standalone fork.
- Route each finding to the project that owns its root cause, not to the project where the symptom appeared.
- Svelte port, CLI, registry, primitives, and docs-site defects go to `huntabyte/shadcn-svelte`.
- Defects and features that originate in shadcn/ui design or component source go to `shadcn-ui/ui`.
- Features absent from shadcn/ui go to `shadcn-ui/ui` first because shadcn-svelte rejects them otherwise.
- Svelte compiler or runtime defects go to `sveltejs/svelte`, SvelteKit defects to `sveltejs/kit`; tell the user first.
- Recommend a standalone fork only with evidence such as rejected or stalled upstream fixes and acceptable maintenance cost.
- The `personal` branch owns fork-only context and tracking; `main` mirrors the fork's integration state.
- `ISSUES.md` provides the compact finding overview and global ID allocator.
- `issues/ISSUE-NNN.md` owns the complete durable record for one root cause.
- `FORMAT.md` owns research, drafting, implementation authorization, approval, and publication rules.
- Prefer small, well-scoped corrections with outsized maintainer or user value.
- Recommend a pull request when a bounded verified fix is ready and no active implementation owns it.
- Otherwise recommend a comment, a new issue, or continued investigation according to the evidence.
- Apply `skill-fork-contribution-tracking` for ledger, lifecycle, personal-branch, and upstream handoff work.
- Apply `skill-maintainer-communication` before external issues, pull requests, reviews, comments, or discussions.
- Search existing work first and follow current upstream templates and disclosure rules.
- Apply `skill-semantic-compression-3` when authoring or restructuring tracking content.
- Apply `skill-git-commit-format` while respecting explicit upstream contribution conventions.
- Never choose `Authorized-Work` or `Publication-Target` on the user's behalf.
- `Research-and-Reporting` permits research, issues, and comments but no source implementation.
- `Pull-Request-Implementation` authorizes only the scoped implementation recorded for that finding.
- Base upstream contribution branches on current `upstream/main`.
- Keep fork-only context, ledgers, configuration, and personal commits out of upstream contribution diffs.
- Reproduce claimed bugs against current upstream and run the narrowest conclusive verification.
- Publish one coherent root cause per issue, comment, or pull request.

## Finding and Contribution Ledger

- At the start of every agent session, agents MUST read root `ISSUES.md` before repository work.
- `ISSUES.md` owns the global `Next finding ID` allocator and compact cross-finding overview.
- Each `issues/ISSUE-NNN.md` owns one finding's state, evidence, drafts, and next action.
- `FORMAT.md` is authoritative for research, drafting, implementation boundaries, and publication format.
- Before adding a finding, search the index and every relevant issue record for the same symptom or root cause.
- New findings MUST use `Next finding ID`.
- Create the issue file, add its index row, and increment the allocator together.
- Finding IDs use `ISSUE-NNN`, start at `ISSUE-001`, and remain permanent.
- Never reuse, renumber, or scope IDs by subsystem, status, session, or contribution type.
- Update the issue file and `ISSUES.md` together after any field, action, or reference change.
- Every issue record MUST use the field and section contract in `FORMAT.md`.
- New findings start with `State: Investigating`.
- New findings start with `Authorized-Work: Not-Selected` and `Publication-Target: Not-Selected`.
- New findings use `External-Reference: Not published.` until an external reference exists.
- Keep findings Investigating until currentness, prior art, impact, and correction value are evidence-backed.
- Clone detectors, AST matches, text similarity, shared names, and TODOs produce candidates only.
- A duplication finding requires shared change pressure, realistic drift, and simpler consolidation.
- The user selects `Authorized-Work` for each finding.
- `Research-and-Reporting` MUST NOT implement the finding.
- `Pull-Request-Implementation` MAY implement only the recorded scope after research resolves callers and failure modes.
- Pull-request work MUST verify behavior, commit, push, and reach `PR-Ready` before publication.
- Show the exact draft and target before publishing an issue, comment, or pull request to official upstream.
- Publish to official upstream only after the user approves the exact current draft and target.
- Any draft or target change requires showing the complete current draft and target again before publication.
- Run the read-only validator bundled with `skill-fork-contribution-tracking` after every ledger mutation.
- Record the final external URL in `External-Reference` immediately after publication.
- Keep `FORMAT.md`, `ISSUES.md`, `issues/`, and fork-only `AGENTS.md` changes out of upstream contribution diffs.

### External publication approval

Only an external issue, comment, review, discussion, or pull request write is approval-gated.
Before publication, read current contribution guidance and explain applicable project policy.
The human must be able to review and own every submission statement.
Fork commits, pushes, tracking updates, and source implementation follow the active repository contract.
Upstream `CONTRIBUTING.md` requires each PR to fix a single issue linked as `Fixes #N`; small fixes may skip the issue.
Upstream PR titles use the prefix `feat:`, `fix:`, `chore:`, or `docs:`; run `pnpm format` and `pnpm lint` first.
Upstream asks contributors not to have AI write issue and PR descriptions; keep drafts short and factual.

## Architecture & Data Flow

- `packages/cli/src/index.ts` is the Commander entry point.
  It registers `add`, `apply`, `init`, `update`, and `registry`, enforces Node 20+, and handles termination signals.
- Command handlers converge on `packages/cli/src/utils/add-registry-items.ts`.
  It fetches the registry index, resolves dependencies recursively, and fetches and validates items.
  It prompts for overwrites, transforms and writes files, and merges CSS and dependency changes.
- `packages/cli/src/utils/registry/` owns network access, proxy handling, concurrent fetches, and dependency resolution.
- `packages/cli/src/utils/registry/schema.ts` is the single owner of registry Zod schemas.
  `packages/cli/src/schema/index.ts` re-exports it as the published `shadcn-svelte/schema` entry.
- `packages/cli/src/utils/config/` reads and validates `components.json`.
  It also synchronizes SvelteKit metadata and resolves aliases from TypeScript configuration.
- `packages/cli/src/utils/transformers/` transforms imports, icons, menus, fonts, and optional TypeScript removal.
  Extend this pipeline rather than adding command-specific rewrites.
- `packages/primitives/` publishes `@shadcn-svelte/primitives`.
  Registry items declare these unstyled components as dependencies.
- `sv-addons/sv/` (`@shadcn-svelte/sv`) is an `sv` add-on that initializes shadcn-svelte and adds components.
- `sv-addons/registry/` (`@shadcn-svelte/registry`) is an `sv` add-on that scaffolds a custom-registry template.
  The template lives in `sv-addons/registry/template/`.
- `packages/parity/` (private) compares shadcn-svelte registry classes against upstream shadcn/ui.
- The docs registry build scans `docs/src/lib/registry/` and invokes the built CLI.
  It writes generated registry JSON and metadata consumed by the site and downstream registries.

Keep command orchestration thin.
Put reusable registry, configuration, transformation, and filesystem behavior in the existing utility owners.
There is no dependency-injection framework; tests isolate boundaries with module mocks and `memfs`.

## Key Directories

- `packages/cli/src/`: CLI commands, configuration, registry access and schemas, transforms, and filesystem utilities.
- `packages/cli/test/`: Vitest unit tests and compatibility fixtures for CLI behavior.
- `packages/primitives/`: SvelteKit-packaged unstyled primitives with Node and browser Vitest configs.
- `packages/parity/`: registry parity checker CLI and its tests.
- `sv-addons/`: `sv` add-on packages; `sv-addons/registry/template/` replaces the former root `registry-template/`.
- `docs/`: SvelteKit documentation site, registry source, content, and generation scripts.
- `docs/src/lib/registry/`: project-owned components, examples, blocks, hooks, utilities, and fonts.
- `repro/`: focused SvelteKit reproduction application; it is not the canonical component library.
- `.changeset/`: release metadata and Changesets configuration.

There is no root `src/` or `scripts/`; source is workspace-local, and build scripts live primarily in `docs/scripts/`.

## Development Commands

Run commands from the repository root unless noted:

```bash
pnpm dev          # develop packages and docs concurrently
pnpm build        # build the documentation site
pnpm build:cli    # build packages/* and sv-addons/*
pnpm check        # run each workspace package's check script in parallel
pnpm test         # run Vitest suites in packages/* and sv-addons/*
pnpm lint         # check Oxfmt formatting, then run ESLint
pnpm format       # format with Oxfmt
pnpm preview      # preview the docs site
pnpm parity       # run the docs parity check against upstream shadcn/ui
```

`pnpm install` runs `postinstall`, which builds the CLI and runs `pnpm -r sync`, regenerating docs registry output.
Useful docs-package generators include `pnpm -F docs build:registry`, `build:icons`, `build:content`, and `build:llms`.
Rebuild generated registry output through these scripts rather than editing it directly.
Build the CLI before docs registry generation because that generator invokes `packages/cli/dist/index.mjs`.

## Code Conventions & Common Patterns

- Use TypeScript and ES modules.
- `oxfmt.config.ts` specifies tabs, double quotes, 100-column code, ES5 trailing commas, and sorted imports.
  It also sorts Tailwind classes in `cn`, `clsx`, and `tv` calls.
- Prefix intentionally unused parameters or variables with `_`; ESLint otherwise reports unused TypeScript names.
- Validate untrusted configuration and registry data with the schema owned by that boundary.
  Do not duplicate registry schemas outside `packages/cli/src/utils/registry/schema.ts`.
- Use `CLIError` or `ConfigError` and the existing `error(cause)`/`handleError` path for CLI failures.
- Do not swallow failures or introduce a parallel error-reporting convention.
- Prefer async functions and `Promise.all` for independent registry fetches.
- Preserve explicit command-level error handling and process-exit behavior.
- Svelte code uses Svelte 5 runes and snippets: `$props`, `$state`, `$derived`, and `{@render ...}`.
- Do not introduce legacy Svelte 4 `asChild` or builder patterns.
- Standard UI modules use `ui/<kebab-case>/index.ts`.
- Single-root modules use named exports; multipart components expose aliases such as `Card.Root`.
- When a snippet renders an interactive child, spread its supplied props so events, focus, and accessibility survive.
- Styling uses Tailwind CSS v4, `tailwind-variants`, `cn`, and theme CSS variables.
- Reuse tokens instead of hard-coded colors, and preserve the configured dark-mode variant.
- Global CSS is imported once from the root `+layout.svelte`; layouts render children with `{@render children()}`.

## Important Files

- `package.json`: root scripts, Node/pnpm requirements, and workspace orchestration.
- `pnpm-workspace.yaml`: workspace membership and shared dependency catalog.
- `packages/cli/src/index.ts`: CLI entry point and command registration.
- `packages/cli/src/utils/add-registry-items.ts`: central component-installation pipeline.
- `packages/cli/src/utils/registry/`: registry fetching, resolution, and validation.
- `packages/cli/src/utils/registry/schema.ts`: registry schemas, published as `shadcn-svelte/schema`.
- `packages/cli/src/utils/config/`: `components.json` schema and alias resolution.
- `docs/scripts/build-registry.ts`: documentation registry generation.
- `eslint.config.js`: JavaScript, TypeScript, and Svelte lint rules.
- `oxfmt.config.ts`: authoritative formatter and import/Tailwind sorting rules.
- `.changeset/config.json`: public-package release policy targeting `main`.

## Runtime/Tooling Preferences

- Use pnpm, not Bun, npm, or Yarn; `package.json` pins `pnpm@10.32.1`, and `preinstall` enforces pnpm.
- Use Node.js 20 or newer; `.nvmrc` pins `v22.15.0`, and `.npmrc` enables strict engine checks.
- `packages/parity` requires Node.js 22.18 or newer.
- The pnpm workspace contains `packages/*`, `docs`, and `sv-addons/*`.
- Oxfmt is the active formatter.
- Use repository scripts instead of invoking SvelteKit, Vite, ESLint, Vitest, or generators through ad hoc wrappers.
- Do not edit build, `.svelte-kit`, `dist`, generated registry, or generated docs outputs by hand.

## Testing & QA

- Tests use Vitest.
  Suites live in `packages/cli/test/`, `packages/primitives/`, `packages/parity/test/`, and `sv-addons/registry/tests/`.
- `packages/primitives` also has a browser suite: `pnpm -F @shadcn-svelte/primitives test:browser`.
  Root `pnpm test` does not run it.
- CLI tests are Node-oriented unit tests that mock modules and prompts and use `memfs`.
  They compare transforms or generated registry data with assertions and inline snapshots.
- Shared CLI fixtures cover full, partial, invalid, and legacy configurations and package-manager detection.
  They also cover colors and Svelte/Tailwind compatibility.
- Reuse these fixtures instead of inventing one-off setup.
- Run focused CLI tests with `pnpm -F shadcn-svelte test`.
  Its `test:setup` first creates and builds the `sv-addons/registry` demo registry.
- Root `pnpm check` covers every workspace package with a `check` script, not `repro`.
- Review inline snapshot changes manually, especially registry JSON and CSS transformer output.
- No coverage threshold or coverage command is configured; do not claim coverage guarantees from test count alone.
- Before submitting, use the narrowest relevant check.
  Use `pnpm check` for Svelte/TypeScript contracts and `pnpm lint` for formatting plus lint validation.
