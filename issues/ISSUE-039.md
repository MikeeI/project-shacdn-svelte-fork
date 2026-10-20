# ISSUE-039 — registry build: per-style rewrite transforms every example although the output drops them

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `rewriteRegistryForStyle` copies and style-transforms the files of every crawled item, while `buildRegistryJson` later keeps only `ITEM_TYPES`, so `registry:example` files are processed per style and then discarded.

## Reach-and-Impact

Reach [S]: Every `pnpm -F docs build:registry`, including the `postinstall` sync.
Impact [S]: 500 top-level example files × 8 styles = 4,000 read-transform-write operations per build that affect no output.
Impact [A]: The share of total build time is unmeasured.

## Evidence

- [S] `docs/scripts/registry.ts:34,95-107` — `crawlExamples` adds every top-level `examples/*.svelte` as `registry:example`.
- [S] `docs/scripts/build-registry.ts:64-75` — runs `rewriteRegistryForStyle` for each of the 8 `PRESET_STYLES`.
- [S] `docs/scripts/build-registry.ts:227-253` — reads, transforms, and writes every file of every item into the style temp dir.
- [S] `docs/scripts/build-registry.ts:298-306` — `ITEM_TYPES` excludes `registry:example` before writing `registry-${style}.json`.
- [O] `git ls-files` at `97fdb936`: 500 top-level `docs/src/lib/registry/examples/*.svelte` files; 8 `styles/style-*.css` files.
- [S] `docs/scripts/build-registry.ts:110-143` — the generated `Index` still needs crawled examples, so the crawl itself must stay.

## Prior-Art

Coverage: issues and PRs (open and closed) via `gh search` for "build-registry examples", "registry build slow", "Index __registry__"; checked=2026-10-20.
Gaps: discussions and Discord were not searched.

- None found.

Contribution fit: New issue only if a measurement shows a material build-time share; otherwise not worth maintainer attention.

## Proposed-Change

In `rewriteRegistryForStyle`, return items whose type is not in `ITEM_TYPES` unchanged instead of rewriting their files, sharing one `ITEM_TYPES` constant with `buildRegistryJson`.

## Scope-and-Constraints

- Preserve: `registrySchema.parse` over all items, the generated `Index`, and byte-identical `static/registry` output.
- Exclude: removing the example crawl or the `Index` generation.

## Performance-Evidence

Not measured.
Required: `time pnpm -F docs build:registry` before and after the change on the same machine, three runs each.

## Verification

- Build before and after → `git diff --stat docs/static/registry` empty.

## Publication-Blockers

- [O] Build-time measurement before and after the change.
- Decision whether the measured saving justifies an issue.

## Next-Action

Summary: Measure registry build time
Action: In a disposable upstream worktree, time `pnpm -F docs build:registry` three times with and without the skip and record the medians.
Done-When: The record contains both medians and an unchanged `static/registry` diff, or the finding is archived as Not-Worth-Pursuing.
