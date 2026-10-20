# ISSUE-002 — docs/create: undo cannot get past a radius-constrained style change

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: The provider corrects `radius` for `lyra`/`sera` (`none`) and `rhea` (`large` → `default`) in a `watch` after the style write, so `StateHistory` records the unconstrained preset and the corrected preset as separate entries.

## Reach-and-Impact

Reach [S]: Any style change on /create into `lyra`, `sera`, or `rhea` from a preset whose radius violates that style, via the style picker, randomize, or undo.
Impact [O]: Undo restores the unconstrained preset, the watch corrects it again as a new entry that clears redo, and the user is stuck on the corrected preset.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider.svelte:43-52` — correcting `watch` writes `designSystem.radius`.
- [S] `docs/node_modules/runed/dist/utilities/state-history/state-history.svelte.js` — every source change logs an entry, and a new entry clears the redo stack.
- [O] `/create/preview-02?preset=<vega+large>` → choose Lyra → Ctrl+Z, Ctrl+Z, Ctrl+Shift+Z on body → stored preset `lyra+none` after every step; environment=`vite dev`, headless Chromium, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found for design system undo or radius correction.

Contribution fit: New contribution — the history-tracked `system` write owns the constraint.

## Proposed-Change

Apply the style radius constraints inside the `DesignSystemState` `system` setter, normalize stored or shared presets once before `StateHistory` starts, and remove the correcting `watch`.

## Scope-and-Constraints

- Preserve: constrained styles still end on `radius: none` or `default`; shared links with violating presets are still corrected.
- Exclude: changing which radii each style supports.
- Cost: behavior change in shared state; the URL `?preset=` of a violating shared link stays unnormalized until the next edit.

## Verification

- Fix branch: `vega+large` → Lyra → undo, undo, redo → `lyra+none`, `vega+large`, `vega+large`, `lyra+none`.
- Fix branch: shared `sera+large` link → stored preset radius `none`.

## Publication-Blockers

- User approval of the exact draft and target.
- Upstream PR template: changes beyond small fixes should reference a discussed issue assigned to the author; decide whether to open an issue first.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Decide issue-first or PR
Action: Ask the user whether to open an upstream issue first or submit the PR draft directly.
Done-When: The user selects issue-first or direct PR and approves the corresponding draft.

## Pull-Request-Implementation

Branch: `fix/docs-design-system-undo-radius`
Base: `upstream/main@7e463da6`
Scope: `design-system-provider-state.svelte.ts` constraint normalization and removal of the provider `watch`.
Commit: `b9b3128b`
Push: `origin/fix/docs-design-system-undo-radius`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed files → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenarios in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-design-system-undo-radius`
Title: fix: keep undo working after switching to lyra, sera, or rhea on /create

Body:

```markdown
On /create, switching from e.g. Vega with a large radius to Lyra can't be undone. The provider fixes the radius in a `watch` after the style changes, so the history gets two entries. Undo goes back to "Lyra + large", the watch corrects it again as a new entry (which also clears redo), and you're stuck on Lyra.

This moves the radius constraints into the `system` setter in `DesignSystemState`, so one change is one history entry, normalizes stored/shared presets once before history tracking starts, and removes the watch.

Repro: open `/create` with Vega + large radius, pick Lyra, press Cmd/Ctrl+Z.
```
