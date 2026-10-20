# ISSUE-030 — registry/ui/carousel: arrow-key navigation only works on the Prev/Next buttons

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `handleKeyDown` is attached only to `Carousel.Previous` and `Carousel.Next`, not to the carousel root as in shadcn/ui.

## Reach-and-Impact

Reach [S]: Keyboard users with focus on slide content or with a disabled end button.
Impact [S]: ArrowLeft and ArrowRight do not scroll the carousel unless a nav button has focus.

## Evidence

- [S] `docs/src/lib/registry/ui/carousel/carousel.svelte:85-92` — root `div` has no key handler.
- [S] `docs/src/lib/registry/ui/carousel/carousel-next.svelte:33` and `carousel-previous.svelte:33` — `onkeydown={emblaCtx.handleKeyDown}`.
- [O] `shadcn-ui/ui` `apps/v4/registry/new-york-v4/ui/carousel.tsx:122` — `onKeyDownCapture={handleKeyDown}` on the region root.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "carousel keyboard arrow"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — parity gap in the port.

## Proposed-Change

Add `onkeydowncapture={handleKeyDown}` to the root `div` before `{...restProps}`.

## Scope-and-Constraints

- Preserve: button key handling and user `onkeydown` overrides.
- Exclude: vertical-orientation key mapping.
- Cost: one attribute.

## Verification

- Focus a link inside a slide → ArrowRight → next slide.

## Publication-Blockers

- [O] StackBlitz reproduction.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a carousel reproduction with focusable slide content and record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Carousel: arrow keys only work while the Previous/Next button is focused

Body:

````markdown
### Describe the bug

`Carousel.Root` defines `handleKeyDown` (ArrowLeft/ArrowRight), but it's only attached to `Carousel.Previous` and `Carousel.Next` (`onkeydown={emblaCtx.handleKeyDown}`). shadcn/ui puts it on the root region (`onKeyDownCapture={handleKeyDown}`), so arrows work wherever focus is inside the carousel. Here, focusing a link or button inside a slide and pressing an arrow key does nothing. Once the end button gets disabled and loses focus, keyboard navigation stops too.

**Possible fix:** add `onkeydowncapture={handleKeyDown}` to the root `div` in `carousel.svelte`.

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
