# ISSUE-036 — docs: superseded color, theme, and block-schema modules have no consumers

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Maintainability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: Consumers moved to `registry/registry-colors.ts`, `registry/themes.ts`, and the generated `__registry__/blocks.ts`, but the superseded modules and the tooling that only they use stayed in `docs/src/lib`.

## Reach-and-Impact

Reach [S]: Docs-site source and `docs/package.json` only; no route, registry item, or CLI output depends on these modules.
Impact [S]: About 2,450 dead lines and three dependencies (`lodash`, `@types/lodash`, `@types/lodash.template`) that maintainers still read, type-check, and update.
Impact [S]: Users see no difference; the value is maintenance and dependency surface only.

## Evidence

- [S] `docs/src/lib/registry/index.ts:1-3` — barrel re-exporting `colors.js`, `themes.js`, `schema.js`; no importer in `docs/`, `packages/`, or `sv-addons/`.
- [S] `docs/src/lib/registry/colors.ts:1-1882` and `docs/src/lib/registry/schema.ts:1-37` — reachable only through that barrel.
- [S] `docs/src/lib/themes.ts:1-31` — `THEMES` has no importer; consumers use `$lib/registry/themes.js`.
- [S] `docs/src/lib/components/colors/color-card.svelte:1-133` — no importer.
- [S] `docs/src/lib/components/colors/colors.ts:1-123` — only `getColorsData` (`:125-152`) has a caller, `docs/scripts/build-registry.ts:17,155`.
- [S] `docs/src/lib/components/colors/colors.ts:1,4,89` — uncalled `generateBaseColorTemplate` is the only user of `lodash.template` and `registry/templates.ts`.
- [S] `docs/src/lib/registry/templates.ts:1-200` — only importer is `components/colors/colors.ts:4`.
- [S] `docs/src/lib/blocks.ts:10-21` — `blockSchema` and `Block` have no consumer.
- [O] Bun, 2026-10-20: `JSON.stringify(colors, null, "\t")` from `registry-colors.ts` equals the committed `docs/static/registry/colors/index.json` (35,592 bytes each).
- [O] `git grep` at `97fdb936` over `docs` (excluding `docs/static`) for these module paths, `blockSchema`, and `lodash` hits only lines inside the unused files, `build-registry.ts:17`, and `docs/package.json:89,90,113`.

## Prior-Art

Coverage: issues and PRs (open and closed) via `gh search` for "unused", "dead code", "remove unused files", "lodash", "colors.ts"; checked=2026-10-20.
Gaps: discussions and Discord were not searched.

- huntabyte/shadcn-svelte#1753 — merged `next: cleanup dead code`; related precedent, different files.
- huntabyte/shadcn-svelte#2622 — merged `lodash` bump; distinct, confirms the dependency is still maintained.

Contribution fit: New issue — docs-site source owns these files; the bug form is the only available form, with Severity `annoyance`.
Routing: [S] shadcn-svelte docs-site code with no shadcn/ui counterpart.

## Proposed-Change

Delete `registry/index.ts`, `registry/colors.ts`, `registry/schema.ts`, `registry/templates.ts`, `lib/themes.ts`, and `components/colors/`.
Delete `blockSchema` and `Block` from `lib/blocks.ts`.
Make `build-registry.ts` serialize `colors` from `registry-colors.ts` directly and drop the three lodash entries from `docs/package.json`.

## Scope-and-Constraints

- Preserve: `static/registry/colors/index.json` bytes, `BlockName`, `isBlock`, and every rendered page.
- Exclude: `registry-colors.ts`, `registry-base-colors.ts`, `registry/themes.ts`, and the CLI.
- Cost: lockfile regeneration in the same PR.

## Shared-Change-Pressure

- [S] `registry/colors.ts` duplicates `registry-colors.ts` data, so color changes made to one copy silently leave the other stale.
- [S] `lodash` receives dependency bumps (#2499, #2622) although no live code path uses it.

## Verification

- `pnpm -F docs build:registry` → `docs/static/registry/colors/index.json` unchanged.
- `pnpm -F docs check` → passes.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves and the issue URL is recorded, or the user declines and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: docs: unused color/theme modules and the `lodash` dependency can be removed

Body:

````markdown
### Describe the bug

Several docs-site modules have no consumers at 97fdb93:

- `docs/src/lib/registry/index.ts` is a barrel that nothing imports.
  Through it, `registry/colors.ts` (1,882 lines, an older copy of `registry-colors.ts`) and `registry/schema.ts` (a hand-written block list replaced by the generated `__registry__/blocks.ts`) are unreachable.
- `docs/src/lib/themes.ts`: every consumer imports `$lib/registry/themes.js` instead.
- `docs/src/lib/components/colors/color-card.svelte` has no importer.
  In `components/colors/colors.ts` only `getColorsData()` is used, by `scripts/build-registry.ts`.
  The uncalled `generateBaseColorTemplate` is the only user of `lodash.template` and of `registry/templates.ts`.
- `blockSchema` and `Block` in `docs/src/lib/blocks.ts`.

`getColorsData()` returns the same data as `colors` from `registry-colors.ts`: `JSON.stringify(colors, null, "\t")` is byte-identical to the committed `static/registry/colors/index.json`.

**Possible fix:** delete these files and exports, let `build-registry.ts` serialize `colors` from `registry-colors.ts` directly, and remove `lodash`, `@types/lodash` and `@types/lodash.template` from `docs/package.json`.
That removes about 2,450 lines and three dependencies without changing the site or the registry output.

### Reproduction

Nothing renders these files, so there is no runtime reproduction.
On commit 97fdb9364926716d33b3c5570ae3a84dd6493428:

```bash
git grep -nE 'registry/(index|colors|schema|templates)(\.js)?["'"'"']|\$lib/registry["'"'"']|lib/themes(\.js)?["'"'"']|color-card\.svelte|components/colors/colors|blockSchema|"lodash"|@types/lodash' -- docs ':!docs/static'
```

The only hits are lines inside the unused files themselves (`blocks.ts:10,21`, `components/colors/colors.ts:1,4`, `color-card.svelte:8`), `build-registry.ts:17` (`getColorsData`), and the three `docs/package.json` entries.

### System Info

Not applicable (repository source at 97fdb93).

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I thoroughly reviewed this contribution with Claude Opus 5.5 (medium reasoning effort).

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
