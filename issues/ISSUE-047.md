# ISSUE-047 — primitives/message-scroller: scroll-to-end button stays inactive after `autoScroll` is turned off

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

Root-Cause [S]: Switching `autoScroll` from true to false at the live edge leaves the follow state set, so later content growth is not recorded as distance from the end and the button's `data-active` stays false.

## Reach-and-Impact

Reach [S]: `MessageScroller` consumers that toggle `autoScroll` at runtime, e.g. a "pause follow" switch.
Impact [O]: After appending content, the viewport is above the end, but `MessageScroller.Button` reports `data-active="false"`, so the built-in return-to-end control is inert.

## Evidence

- [S] `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts:569,674-688,706-707` — follow state and button activity derive from the auto-scroll path.
- [O] `97fdb93`, Chromium headless, Node 26.12.0: browser test renders 8 items with `autoScroll: true`, sets `autoScroll: false`, appends one item; `getDistanceToBottom(viewport) > 0` passes, `button.dataset.active` is `"false"` (expected `"true"`).
- [O] Test and page: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "message-scroller", "MessageScroller", and "autoScroll"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2886` — Related; introduced `@shadcn-svelte/primitives` and MessageScroller.
- No issue mentions this behavior.

Contribution fit: New issue — new primitive; a failing browser test fits the maintainer's existing suite.

## Proposed-Change

When `autoScroll` becomes false, clear the follow state so later scroll metrics update the button.

## Scope-and-Constraints

- Preserve: follow-output while `autoScroll` is true.
- Exclude: anchoring behavior.
- Cost: unknown until the maintainer chooses where follow state resets.

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
Title: MessageScroller: scroll-to-end button stays inactive after turning `autoScroll` off

Body:

````markdown
### Describe the bug

If `autoScroll` is switched from `true` to `false` while the viewport is at the end, and then a message is appended, the viewport is no longer at the end, but `MessageScroller.Button` keeps `data-active="false"`. So the button can't be used to jump back.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives (first section)

It contains a browser test for `message-scroller.browser.test.ts` that uses the existing helpers, plus a small `+page.svelte`. In Chromium the test fails with `expected "true", received "false"` for `button.dataset.active`, after `getDistanceToBottom(viewport) > 0` passed.

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
