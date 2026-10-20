# ISSUE-049 — primitives/message-scroller: scrolling without wheel, touch, or key events does not release the anchor hold

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: Medium
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: The anchor hold is released only by wheel, touch, and key handlers; a plain `scroll` event, as produced by dragging the scrollbar, leaves it active.

## Reach-and-Impact

Reach [S]: Users who drag the scrollbar away from an anchored turn while a reply streams.
Impact [O]: The next content resize restores the old anchored position, pulling the reader back.
Impact [S]: The docs say dragging the scrollbar releases the view.

## Evidence

- [S] `packages/primitives/src/lib/message-scroller/message-scroller.svelte.ts:681,990,1096-1107` — release paths and the resize restore.
- [S] `docs/content/components/message-scroller.md:259-261` — "Scrolling away from the live edge releases the view, whether by wheel, touch, keyboard scroll keys, or dragging the scrollbar."
- [O] `97fdb93`, Chromium headless, Node 26.12.0: browser test lowers `viewport.scrollTop` from 896 to 832 and dispatches only `scroll`; after the reply grows, scrollTop is 896 again (expected 832).
- [O] Test and page: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives
- [A] A real pointer drag on the scrollbar produces only `scroll` events; the test simulates that path and was not run with a pointer drag.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "message-scroller", "MessageScroller", and "scrollbar"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2886` — Related; introduced MessageScroller.

Contribution fit: New issue — behavior contradicts the component docs.

## Proposed-Change

Release the hold when a `scroll` event moves away from the expected anchored position without a programmatic scroll in flight.

## Scope-and-Constraints

- Preserve: programmatic anchoring scrolls.
- Exclude: wheel, touch, and key paths.
- Cost: needs a guard to distinguish programmatic scrolls.

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
Title: MessageScroller: dragging the scrollbar doesn't release the anchored turn

Body:

````markdown
### Describe the bug

The docs say scrolling away "by wheel, touch, keyboard scroll keys, or dragging the scrollbar" releases the view. Only the wheel, touch, and key handlers release the anchor hold, though. A scroll that only fires `scroll` events, like dragging the scrollbar, keeps it, and the next resize of the streamed reply moves the viewport back to the anchored position.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/primitives (third section)

Browser test for `message-scroller.browser.test.ts` plus a `+page.svelte`. The test lowers `scrollTop` from 896 to 832 and dispatches `scroll`. After the reply grows, `scrollTop` is 896 again. The test simulates the scrollbar path; I didn't test with a real pointer drag.

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
