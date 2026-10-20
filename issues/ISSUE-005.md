# ISSUE-005 — docs/colors: last copied swatch is never highlighted

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: `UseClipboard` declares `#lastCopied` and exposes `lastCopied`, but `copy()` never assigns it.

## Reach-and-Impact

Reach [S]: Every swatch on /colors, whose `data-last-copied` styles depend on `clipboard.lastCopied`.
Impact [O]: The copied swatch never gets its persistent check icon and primary label color; copying itself works.

## Evidence

- [S] `docs/src/lib/hooks/use-clipboard.svelte.ts:35,51-64` — `#lastCopied` is initialized and never written.
- [S] `docs/src/lib/components/color.svelte:16,24,33,38` — `data-last-copied` drives icon and label styles.
- [O] /colors → click swatch `neutral-300` → clipboard `oklch(0.87 0.00 0)`, `data-last-copied="false"` on all swatches; environment=`vite dev`, headless Chromium with clipboard permission, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found for the colors page copy highlight.

Contribution fit: New contribution — the clipboard hook owns `lastCopied`.
Routing: [S] Still present at `upstream/main@ffcd275b`; `shadcn-ui/ui@ba1503c` sets `lastCopied` on click (`apps/v4/components/color.tsx:26-37`, `apps/v4/hooks/use-colors.ts:24-26`), so shadcn/ui does not share the defect.
Sibling-Candidate: [S] `shadcn-ui/ui@ba1503c` marks a swatch copied and toasts success even when copying fails (`apps/v4/components/color.tsx:26-37`, `apps/v4/hooks/use-copy-to-clipboard.ts:47-62`); separate root cause, not yet a finding.

## Proposed-Change

Assign `#lastCopied` after a successful copy.

## Scope-and-Constraints

- Preserve: failed copies do not change `lastCopied`.
- Exclude: colors page restyling.
- Cost: three lines in one hook.

## Verification

- Fix branch: /colors → click swatch → that swatch `data-last-copied="true"`, exactly one such swatch.

## Publication-Blockers

- User approval of the exact draft and target.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Await draft approval
Action: Present the exact PR draft and target to the user for approval.
Done-When: The user approves, edits, or rejects the draft.

## Pull-Request-Implementation

Branch: `fix/docs-clipboard-last-copied`
Base: `upstream/main@7e463da6`
Scope: `docs/src/lib/hooks/use-clipboard.svelte.ts` `copy()`.
Commit: `77cfaa5c`
Push: `origin/fix/docs-clipboard-last-copied`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenario in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-clipboard-last-copied`
Title: fix: highlight the last copied color on /colors

Body:

```markdown
`UseClipboard` has a `lastCopied` getter that the color swatches use for `data-last-copied`, but `copy()` never sets it, so the copied swatch is never highlighted.

This sets it after a successful copy.
```
