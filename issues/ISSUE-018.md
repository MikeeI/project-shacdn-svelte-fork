# ISSUE-018 — registry/ui/carousel: navigation state goes stale after Embla `reInit`

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `Carousel.Root` subscribes only to Embla's `select` event, so `canScrollPrev`, `canScrollNext`, `selectedIndex`, and `scrollSnaps` are never refreshed on `reInit`.

## Reach-and-Impact

Reach [S]: Carousels whose slides change after mount or whose snap count changes on resize.
Impact [A]: `Carousel.Next` stays disabled after slides load asynchronously, and `scrollSnaps` has the wrong length after a resize.

## Evidence

- [S] `docs/src/lib/registry/ui/carousel/carousel.svelte:74,80` — only `on("select")` and `off("select")`.
- [S] `embla-carousel@8.6.0` `reActivate` emits `reInit` without `select`.
- [O] `shadcn-ui/ui` `apps/v4/registry/new-york-v4/ui/carousel.tsx:99` — `api.on("reInit", onSelect)`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "carousel reInit" and "carousel canScrollNext"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — port omits the upstream `reInit` subscription.

## Proposed-Change

Subscribe to `reInit`, refresh `scrollSnaps`, call `onSelect()`, and unsubscribe in cleanup.

## Scope-and-Constraints

- Preserve: `setApi` and existing `select` behavior.
- Exclude: carousel keyboard handling (ISSUE-030).
- Cost: a few lines.

## Verification

- Mount with zero items, then add five → `Carousel.Next` becomes enabled.

## Publication-Blockers

- [O] StackBlitz or repository reproduction with async slides.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a reproduction that adds slides after mount, record the disabled Next button, the link, and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Carousel: Next/Previous state isn't updated on Embla `reInit` (e.g. slides loaded after mount)

Body:

````markdown
### Describe the bug

`carousel.svelte` only subscribes to Embla's `select` event. Embla emits `reInit` without `select` when slides are added or removed, and when the snap count changes on resize. So `canScrollNext`, `canScrollPrev`, `selectedIndex`, and `scrollSnaps` keep their initial values. A carousel that mounts with no slides and loads them later keeps `Carousel.Next` disabled. shadcn/ui's carousel also listens to `reInit` (`api.on("reInit", onSelect)`).

**Possible fix:** in `onInit`, also subscribe to `reInit`, refresh `scrollSnaps` there, call `onSelect()`, and remove the listener in the cleanup.

### Reproduction

Pending: StackBlitz link.

### System Info

Pending: envinfo output.

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
