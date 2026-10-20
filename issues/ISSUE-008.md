# ISSUE-008 — docs/create: randomize with a locked theme produces invalid base color pairs

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: `randomize()` draws the base color without regard to a locked theme or chart color, although base themes such as `neutral` are only valid with their own base color.

## Reach-and-Impact

Reach [S]: Users who lock the theme or chart color to a base theme and press `r` or Shuffle on /create.
Impact [O]: Presets such as `stone` + `neutral` result, which `designSystemConfigSchema` rejects and which render the neutral palette under another base color label.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider-state.svelte.ts:279-298` — base color drawn from all keys; locked theme and chart color kept as-is.
- [S] `docs/src/lib/registry/config.ts:77-80` — schema refine requires the theme to be offered by the base color.
- [S] `docs/src/lib/features/design-system/components/design-system-provider-state.svelte.ts:184-191` — the `baseColor` setter already keeps theme and chart color consistent for manual edits.
- [O] theme locked to `neutral` → 12× `r` → 12/12 invalid pairs (`zinc/neutral`, `olive/neutral`, `stone/neutral`, …), `--muted` stays `oklch(0.97 0 0)`; environment=`vite dev`, headless Chromium, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found for randomize locks.

Contribution fit: New contribution — `randomize()` owns the lock semantics.
Routing: [S] Still present at `upstream/main@ffcd275b`; `shadcn-ui/ui@ba1503c` selects locks and base colors independently (`apps/v4/app/(app)/(create)/hooks/use-random.tsx`) but normalizes incompatible theme and chart pairs on read and write (`lib/search-params.ts:174-239,307-342`), so its persisted pairs stay valid.
Sibling-Candidate: [S] `shadcn-ui/ui@ba1503c` normalization ignores locks and can replace a locked theme or chart color; separate root cause, not yet a finding.

## Proposed-Change

Draw the base color only from base colors that offer every locked color; keep the current base color when none does.

## Scope-and-Constraints

- Preserve: locked values never change; unlocked randomization stays unrestricted when no colors are locked.
- Exclude: the separate no-op second `.refine` in `designSystemConfigSchema` (`config.ts:81-84`).
- Cost: design choice; a locked base theme now pins the base color, which maintainers might prefer to solve differently.

## Verification

- Fix branch: theme `neutral` locked → 12/12 `neutral/neutral/*`.
- Fix branch: theme `blue` locked → varied base colors, all valid.
- Fix branch: chart color `neutral` locked → 12/12 valid; no locks → varied and valid.

## Publication-Blockers

- User approval of the exact draft and target.
- Upstream PR template: changes beyond small fixes should reference a discussed issue; the lock semantics may need maintainer input first.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Decide issue-first or PR
Action: Ask the user whether to open an upstream issue first or submit the PR draft directly.
Done-When: The user selects issue-first or direct PR and approves the corresponding draft.

## Pull-Request-Implementation

Branch: `fix/docs-randomize-locked-theme`
Base: `upstream/main@7e463da6`
Scope: `design-system-provider-state.svelte.ts` `randomize()` base color selection.
Commit: `5c6074fa`
Push: `origin/fix/docs-randomize-locked-theme`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenarios in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-randomize-locked-theme`
Title: fix: keep randomized presets valid when the theme is locked

Body:

```markdown
If you lock the theme (or chart color) to a base theme like `neutral` on /create and shuffle, the base color is still picked from all base colors. That gives presets like stone + neutral theme, which the design system config schema doesn't allow, and the page shows the neutral palette while the base color says stone.

This picks the random base color only from the ones that offer the locked theme/chart color, and keeps the current base color if none does.
```
