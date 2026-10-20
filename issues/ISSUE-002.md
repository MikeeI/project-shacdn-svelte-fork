# ISSUE-002 — docs/create: undo cannot get past a radius-constrained style change

State: Submitted
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2938
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-21
Source: `upstream/main@99e2246b`

## Root-Cause

Root-Cause [S]: The provider corrects `radius` for `lyra`/`sera` (`none`) and `rhea` (`large` → `default`) in a `watch` after the style write, so `StateHistory` records the unconstrained preset and the corrected preset as separate entries.

## Reach-and-Impact

Reach [S]: Any style change on /create into `lyra`, `sera`, or `rhea` from a preset whose radius violates that style, via the style picker, randomize, or undo.
Impact [O]: Undo restores the unconstrained preset, the watch corrects it again as a new entry that clears redo, and the user is stuck on the corrected preset.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider.svelte:43-52` — correcting `watch` writes `designSystem.radius`.
- [S] `docs/node_modules/runed/dist/utilities/state-history/state-history.svelte.js` — every source change logs an entry, and a new entry clears the redo stack.
- [O] `/create/preview-02?preset=<vega+large>` → choose Lyra → Ctrl+Z, Ctrl+Z, Ctrl+Shift+Z on body → stored preset `lyra+none` after every step; environment=`vite dev`, headless Chromium, Linux x64.
- [O] 2026-10-21, official `/create/preview-02`, headless Chromium: Vega/Large → Lyra/None → Ctrl+Z, Ctrl+Z, Ctrl+Shift+Z remained Lyra/None.
- [O] The stored preset stayed `"buFywLo"` after every undo/redo step; the initial Vega/Large preset was `"bIkeyqO"`.
- [S] Current upstream `99e2246b` retains the provider's radius-correcting watch and unnormalized history-tracked state setter.
- [O] `@ieedan/label@0.0.1 --dry-run` with full label policy and a simulated new issue returned `slop=0.17,0.16`.
- [O] Classifier model was `jev-1.13.0`; context had author role `CONTRIBUTOR`, zero comments, and no existing labels.
- [O] The user approved the exact tested title and body, then publication created https://github.com/huntabyte/shadcn-svelte/issues/2938.

## Prior-Art

Coverage: issues and PRs, open and closed, searched for `undo`, `radius create`, and `radius history`; checked=2026-10-21.
Gaps: discussions and releases were not searched.

- None found for design system undo or radius correction.
- `https://github.com/huntabyte/shadcn-svelte/issues/2901` — Distinct; radius-scale mismatch between preview and CLI, not undo history.
- `https://github.com/huntabyte/shadcn-svelte/pull/2800` — Search candidate; Typeset feature title, not established as an undo fix.

Contribution fit: New contribution — the history-tracked `system` write owns the constraint.
Routing: [S] Still present at `upstream/main@ffcd275b`; `shadcn-ui/ui@ba1503c` has an analogous radius correction (`apps/v4/app/(app)/(create)/components/design-system-provider.tsx:143-152`) but records settled nuqs URL presets (`hooks/use-history.tsx:21-105`). [A] Whether shadcn/ui hits the same undo trap is unverified; no sibling finding exists.

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

None.

## Next-Action

Summary: Monitor issue response
Action: Monitor https://github.com/huntabyte/shadcn-svelte/issues/2938 and answer maintainer questions with new evidence only.
Done-When: Upstream resolves the report or requests a bounded follow-up, and the finding's next action is updated.

## Pull-Request-Implementation

Existing prepared fix, not published as a PR or revalidated against the current upstream during issue publication.

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

Historical PR draft retained verbatim; the user selected an issue-first publication and approved `Submitted-Text` below.

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-design-system-undo-radius`
Title: fix: keep undo working after switching to lyra, sera, or rhea on /create

Body:

```markdown
On /create, switching from e.g. Vega with a large radius to Lyra can't be undone. The provider fixes the radius in a `watch` after the style changes, so the history gets two entries. Undo goes back to "Lyra + large", the watch corrects it again as a new entry (which also clears redo), and you're stuck on Lyra.

This moves the radius constraints into the `system` setter in `DesignSystemState`, so one change is one history entry, normalizes stored/shared presets once before history tracking starts, and removes the watch.

Repro: open `/create` with Vega + large radius, pick Lyra, press Cmd/Ctrl+Z.
```

## Submitted-Text

Target: New issue in `huntabyte/shadcn-svelte`.
URL: https://github.com/huntabyte/shadcn-svelte/issues/2938
Approval: User requested publication of the exact tested issue title and description on 2026-10-21.
Title: Undo gets stuck after switching from Vega to Lyra on /create
Publication: `gh issue create` succeeded; no PR was opened.

Body:

````markdown
### Describe the bug

Switching from Vega with radius Large to Lyra cannot be undone.
Ctrl+Z leaves Lyra selected instead of restoring Vega and Large.
Pressing undo again or redo also leaves it on Lyra.

### Reproduction

https://shadcn-svelte.com/create/preview-02

1. Select Vega and set Radius to Large.
2. Select Lyra, then close the style menu with Escape.
3. Press Ctrl+Z with focus outside a text field.

Expected: Vega with radius Large.
Actual: Lyra with radius None.

### Logs

Observed picker values:

```text
Before switching: Vega / Large
After switching: Lyra / None
Ctrl+Z: Lyra / None
Ctrl+Z again: Lyra / None
Ctrl+Shift+Z: Lyra / None
```
````
