# ISSUE-048 — primitives/message-scroller: replacing a keyed row jumps to an old initial `scrollAnchor`

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: Medium
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: Anchors present in the initial items are never marked handled, and an equal-count keyed update is treated as a new turn that scrolls to the oldest unhandled anchor.

## Reach-and-Impact

Reach [S]: Threads that render `scrollAnchor` items on first load and later replace a row in place, e.g. editing or regenerating a message.
Impact [O]: The viewport jumps from the end to the top.

## Evidence

- [S] `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts:950,955-962` — new-turn detection and anchor lookup.
- [S] `packages/primitives/src/lib/message-scroller/geometry.ts:125-136` — oldest unhandled anchor selection.
- [O] `97fdb93`, Chromium headless, Node 26.12.0: browser test with eight anchored initial rows, replace keyed row 3 with constant item count; `getScrollTop(viewport)` expected `440`, received `0`.
- [O] Test and page: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "message-scroller", "MessageScroller", and "scrollAnchor"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2886` — Related; introduced MessageScroller.
- No issue mentions this behavior.

Contribution fit: New issue — failing browser test for a new primitive.

## Proposed-Change

Mark anchors from the initial render as handled, or only treat appended keys as a new turn.

## Scope-and-Constraints

- Preserve: anchoring of genuinely new turns.
- Exclude: scroll restoration on remount.
- Cost: unknown until the maintainer picks the turn-detection rule.

## Verification

- The browser test in the reproduction passes.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: MessageScroller: replacing a row jumps to an old `scrollAnchor` from the initial items

Body:

````markdown
### Describe the bug

When the initial items already have `scrollAnchor`, those anchors are never marked as handled. Replacing one keyed row later (same item count, e.g. editing a message) is treated like a new turn, and the viewport jumps from the end to the oldest of those anchors.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives (second section)

Browser test for `message-scroller.browser.test.ts` plus a `+page.svelte`. With eight anchored rows, replacing row 3 moves `scrollTop` from `440` to `0`.

### System Info

```text
huntabyte/shadcn-svelte@97fdb93, pnpm -F @shadcn-svelte/primitives test:browser
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
Binaries:
  Node: 26.12.0 - /usr/bin/node
  pnpm: 10.32.1 - /usr/bin/pnpm
Browsers:
  Chromium: 155.0.8059.79 (headless)
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
