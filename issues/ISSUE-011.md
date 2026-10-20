# ISSUE-011 — registry/blocks: relative `../ui/` imports break after installing three blocks

State: Submitted
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2933
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-21
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: Three block sources import UI files through relative `../ui/...` paths, which neither the docs dependency scanner nor the CLI alias rewrite recognizes.

## Reach-and-Impact

Reach [S]: `calendar-12`, `chart-area-interactive`, and `chart-pie-interactive` in every style.
Impact [S]: The CLI installs blocks into the components alias, so `../ui/...` resolves outside the UI alias and the import fails; `calendar-12` also omits `range-calendar` from `registryDependencies`.

## Evidence

- [S] `docs/src/lib/registry/blocks/calendar-12.svelte:5` — `import RangeCalendar from "../ui/range-calendar/range-calendar.svelte"`.
- [S] `docs/src/lib/registry/blocks/chart-area-interactive.svelte:9` and `chart-pie-interactive.svelte:7` — `../ui/chart/chart-container.svelte` and `../ui/chart/chart-style.svelte`.
- [O] `docs/static/registry/styles/nova/calendar-12.json` → content keeps `../ui/range-calendar/...`; `registryDependencies` = `card,select`.
- [S] `docs/scripts/registry.ts` `getFileDependencies` — only `$lib/` imports produce registry dependencies.
- [S] `packages/cli/src/commands/registry/build.ts:228-239` — `transformAliases` rewrites aliases only.
- [S] `packages/cli/src/utils/registry/index.ts:215-217` — blocks and components install into `resolvedPaths.components`.
- [O] `https://github.com/MikeeI/shadcn-svelte-repros/tree/main/blocks-relative-ui-imports` → after `add calendar-12 chart-area-interactive chart-pie-interactive`, `pnpm build` fails with three `UNRESOLVED_IMPORT` errors for the `../ui/...` paths; environment=`shadcn-svelte@1.7.0`, Node 26.12.0, Linux x64.
- [O] 2026-10-21: `@ieedan/label@0.0.1 --dry-run`, full label policy, and existing issue conversation used TypeSafe `jev-1.13.0`.
- [O] Original description scored `slop=0.82,0.80`; the approved revision scored `0.47,0.48`, below the `0.60` application threshold.
- [O] The user approved the exact revision before publication; GitHub's saved body matched the approved text after editing.
- [O] The title and existing `contributions welcome`, `cli`, and `slop` labels remained unchanged after the edit.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "calendar-12 import" and "chart-area-interactive import"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2732` — Related; open Range Calendar refactor regenerates `calendar-12.json` but leaves the relative import.

Contribution fit: New issue — block sources own their imports.
Routing: [S] shadcn/ui blocks import through `@/registry/...` aliases, so the defect is port-specific.

## Proposed-Change

Import through `$lib/registry/ui/...` paths: `range-calendar/index.js` for `calendar-12`, `Chart.Container` for `chart-area-interactive`, and `$lib/registry/ui/chart/chart-style.svelte` for `chart-pie-interactive`.

## Scope-and-Constraints

- Preserve: rendering of the three blocks on the docs site.
- Exclude: dependency-scanner changes for relative imports.
- Cost: three import lines plus regenerated registry output.

## Verification

- `pnpm -F docs build:registry` → no `../ui` in `docs/static/registry`; `calendar-12` lists `range-calendar`.
- Install `calendar-12` into a fresh SvelteKit app → `pnpm check` passes.

## Publication-Blockers

None.

## Next-Action

Summary: Monitor revised issue response
Action: Monitor https://github.com/huntabyte/shadcn-svelte/issues/2933 and answer maintainer questions with new evidence only.
Done-When: The issue is closed or a fix is merged, and the record is archived.

## Publication-Draft

Historical initial draft, retained verbatim; `Submitted-Text` below owns the current published description.

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order, created with `gh issue create`; Severity `annoyance`; disclosure is the final section.
Title: `calendar-12`, `chart-area-interactive` and `chart-pie-interactive` blocks ship relative `../ui/` imports that break after install

Body:

````markdown
### Describe the bug

Three blocks import UI files with relative paths:

- `calendar-12.svelte`: `import RangeCalendar from "../ui/range-calendar/range-calendar.svelte"`
- `chart-area-interactive.svelte`: `import ChartContainer from "../ui/chart/chart-container.svelte"`
- `chart-pie-interactive.svelte`: `import ChartStyle from "../ui/chart/chart-style.svelte"`

Inside the docs these work because `registry/blocks/` and `registry/ui/` are siblings. The registry build only rewrites `$lib/registry/...` aliases, though, so the published JSON keeps `../ui/...`. The CLI installs blocks into the components alias (`src/lib/components/calendar-12.svelte`), where `../ui/...` points to `src/lib/ui/...`, so the build fails.

`calendar-12` also doesn't list `range-calendar` in its `registryDependencies` (only `card` and `select`), because the dependency scan in `docs/scripts/registry.ts` only looks at `$lib/` imports. In a project that doesn't have `range-calendar` yet, it isn't installed at all.

**Possible fix:** import through the aliases like the other blocks do: `$lib/registry/ui/range-calendar/index.js` in `calendar-12`, `Chart.Container` (the `Chart` namespace is already imported) in `chart-area-interactive`, and `$lib/registry/ui/chart/chart-style.svelte` in `chart-pie-interactive` (`ChartStyle` isn't exported from the chart `index.ts`).

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/blocks-relative-ui-imports

Official `repro` template plus the three blocks, committed as installed:

```bash
pnpm install
pnpm dlx shadcn-svelte@latest add calendar-12 chart-area-interactive chart-pie-interactive --yes --overwrite
pnpm build
```

### Logs

```bash
[UNRESOLVED_IMPORT] Could not resolve '../ui/range-calendar/range-calendar.svelte' in src/lib/components/calendar-12.svelte
[UNRESOLVED_IMPORT] Could not resolve '../ui/chart/chart-container.svelte' in src/lib/components/chart-area-interactive.svelte
[UNRESOLVED_IMPORT] Could not resolve '../ui/chart/chart-style.svelte' in src/lib/components/chart-pie-interactive.svelte
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
  @lucide/svelte: ^1.60.0 => 1.60.0
  @sveltejs/kit: 2.70.1 => 2.70.1
  bits-ui: ^2.18.0 => 2.19.5
  svelte: ^5.55.7 => 5.57.2
  tailwindcss: ^4.3.3 => 4.3.3
shadcn-svelte CLI: 1.7.0 (via pnpm dlx)
```

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````

## Submitted-Text

Target: Replace the description of https://github.com/huntabyte/shadcn-svelte/issues/2933; leave its title unchanged.
Approval: The user approved the complete revised text via `q1 ha` on 2026-10-21.
Publication: `gh issue edit 2933 --repo huntabyte/shadcn-svelte --body-file <approved-body-file>` succeeded.
Verification: GitHub API confirmed the saved body matches the approved text.
System Info, Severity, and the disclosure footer are omitted under the repository's user-directed publication format.
The existing `slop` label was not removed; no comment or label change was requested.

Body:

````markdown
### Describe the bug

`pnpm build` fails after adding `calendar-12`, `chart-area-interactive` and `chart-pie-interactive`.
Their `../ui/` imports point to `src/lib/ui/` instead of the installed components in `src/lib/components/ui/`.
`calendar-12` is also missing `range-calendar` from its registry dependencies.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/blocks-relative-ui-imports

The broken files are committed in the repro (installed with CLI 1.7.0).
Run `pnpm install` and `pnpm build` in that directory.

### Logs

```text
[UNRESOLVED_IMPORT] Could not resolve '../ui/range-calendar/range-calendar.svelte' in src/lib/components/calendar-12.svelte
[UNRESOLVED_IMPORT] Could not resolve '../ui/chart/chart-container.svelte' in src/lib/components/chart-area-interactive.svelte
[UNRESOLVED_IMPORT] Could not resolve '../ui/chart/chart-style.svelte' in src/lib/components/chart-pie-interactive.svelte
```
````
