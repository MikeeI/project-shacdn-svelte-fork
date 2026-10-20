# ISSUE-059 — primitives/questionnaire: a skipped uncontrolled item keeps its text and `data-filled` but leaves FormData

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: Low
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: Skip clears the item's answer and removes the input's `name`/`form` association, but leaves the uncontrolled input's DOM value, so `data-filled` stays true.

## Reach-and-Impact

Reach [S]: Optional uncontrolled Questionnaire items that the user types into and then skips.
Impact [O]: Returning to the item shows the typed text and `data-filled`, while `FormData.get(name)` is `null`.
Impact [A]: Users may think the visible draft will be submitted; the primitive may intend this as draft preservation.

## Evidence

- [S] `packages/primitives/src/lib/questionnaire/questionnaire.svelte.ts:769-774,1139-1178,1228-1229` — skip status, filled state, and form association.
- [O] `97fdb93`, Chromium headless, Node 26.12.0: characterization test passed: after typing `Draft`, Skip, Previous, the item has `data-status="skipped"`, value `Draft`, `data-filled`, no `name`, `form=""`, and `FormData.get("optional") === null`.
- [O] Test: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives (fourth section)

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "questionnaire"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2886` — Related; introduced Questionnaire.

Contribution fit: Undecided — the behavior may be intended draft preservation.

## Proposed-Change

Either clear the DOM value on skip, or keep `data-filled` false for skipped items; maintainer intent decides.

## Scope-and-Constraints

- Preserve: controlled items.
- Exclude: submission rules for answered items.
- Cost: small once intent is clear.

## Verification

- Characterization test asserts the chosen contract.

## Publication-Blockers

- Evidence that the current state is unintended, e.g. docs or maintainer statement; otherwise this reads as a question, not a bug.

## Next-Action

Summary: Decide publication value
Action: Check the Questionnaire docs for skip semantics and decide with the user whether to report, ask in a discussion, or archive.
Done-When: The record states the decision with evidence.
