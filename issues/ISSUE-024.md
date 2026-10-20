# ISSUE-024 — registry/ui/calendar: multi-month dropdown captions format `placeholder` instead of each month

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

Root-Cause [S]: The `dropdown-months` and `dropdown-years` caption branches format the shared `placeholder`, not the panel's own `month`.

## Reach-and-Impact

Reach [S]: `Calendar` and `RangeCalendar` with `numberOfMonths > 1` and `captionLayout` `dropdown-months` or `dropdown-years`.
Impact [S]: `dropdown-years` repeats the first panel's month name; `dropdown-months` shows the previous year on a panel after a year boundary.

## Evidence

- [S] `docs/src/lib/registry/ui/calendar/calendar-caption.svelte:67,71` — `formatYear(placeholder)`, `formatMonth(placeholder)`.
- [S] `docs/src/lib/registry/ui/calendar/calendar-caption.svelte:75` — the label branch uses `month`.
- [S] `docs/src/lib/registry/ui/range-calendar/range-calendar-caption.svelte` — same branches.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "calendar caption dropdown numberOfMonths"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2732` — Related; open Range Calendar refactor may remove `range-calendar-caption.svelte`.

Contribution fit: New issue — caption components own per-panel labels.

## Proposed-Change

Use `formatYear(month)` and `formatMonth(month)` in both caption components.

## Scope-and-Constraints

- Preserve: dropdown selection offset by `monthIndex`.
- Exclude: caption layout changes.
- Cost: four expressions.

## Verification

- `<Calendar numberOfMonths={2} captionLayout="dropdown-years" />` → two different month names.

## Publication-Blockers

- [O] StackBlitz reproduction.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a reproduction with two months and `dropdown-years`, then record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Calendar: with `numberOfMonths > 1`, `dropdown-months`/`dropdown-years` captions show the wrong month or year

Body:

````markdown
### Describe the bug

`calendar-caption.svelte` (and `range-calendar-caption.svelte`) get a per-panel `month`, and the `label` branch uses it. The `dropdown-months` branch renders `formatYear(placeholder)` and the `dropdown-years` branch renders `formatMonth(placeholder)`, though, so with `numberOfMonths={2}`:

- `captionLayout="dropdown-years"`: both panels show the first month's name.
- `captionLayout="dropdown-months"`: a panel in January after a December panel shows the previous year.

**Possible fix:** use `formatYear(month)` and `formatMonth(month)` in those two branches.

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
