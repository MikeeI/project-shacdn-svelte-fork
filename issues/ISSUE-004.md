# ISSUE-004 — docs/create: Cmd/Ctrl+Z in text fields undoes the preset

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: The provider's window `keydown` handler skips editable targets only for the `r` shortcut, so Cmd/Ctrl+Z in inputs calls `preventDefault()` and runs the preset undo.

## Reach-and-Impact

Reach [S]: Every input, textarea, select, and contenteditable element inside pages with the design system provider, including the preview components.
Impact [O]: Native text undo is blocked in those fields, and the preset changes instead.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider.svelte:161-192` — editable-target check sits inside the `r` branch only.
- [O] `/preview/preview` text input → dispatched Ctrl+Z `keydown` → `defaultPrevented: true`; environment=`vite dev`, headless Chromium, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found for keyboard shortcuts in the design system provider.

Contribution fit: New contribution — the shared keydown handler owns both shortcuts.
Routing: [S] Still present at `upstream/main@ffcd275b`; `shadcn-ui/ui@ba1503c` rejects editable targets before undo/redo (`apps/v4/app/(app)/(create)/hooks/use-history.tsx:128-162`, `components/history-buttons.tsx:42-77`), so shadcn/ui does not share the defect.

## Proposed-Change

Return early from the handler for editable targets before both the `r` and the `z` shortcuts.

## Scope-and-Constraints

- Preserve: shortcuts outside editable elements keep working.
- Exclude: new shortcuts or shortcut configuration.
- Cost: none beyond moving one condition.

## Verification

- Fix branch: Ctrl+Z and `r` on a text input → `defaultPrevented: false`; Ctrl+Z on body → `defaultPrevented: true`.

## Publication-Blockers

- User approval of the exact draft and target.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Await draft approval
Action: Present the exact PR draft and target to the user for approval.
Done-When: The user approves, edits, or rejects the draft.

## Pull-Request-Implementation

Branch: `fix/docs-undo-shortcut-in-text-fields`
Base: `upstream/main@7e463da6`
Scope: `design-system-provider.svelte` `handleKeyDown` editable-target guard.
Commit: `315ac105`
Push: `origin/fix/docs-undo-shortcut-in-text-fields`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenario in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-undo-shortcut-in-text-fields`
Title: fix: don't hijack Cmd/Ctrl+Z in text fields on /create

Body:

```markdown
The design system provider listens for Cmd/Ctrl+Z on the window to undo preset changes. It already ignores inputs for the `r` shortcut, but not for undo, so pressing Cmd/Ctrl+Z while typing in an input in the previews undoes the preset instead of the text.

This moves the editable-target check to the top of the handler so it covers both shortcuts.
```
