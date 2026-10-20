# ISSUE-031 — registry/blocks: `calendar-29` label points to an id the input does not have

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

Root-Cause [S]: `calendar-29` renders `Label for="{id}-date"` but gives the input the static id `date`.

## Reach-and-Impact

Reach [S]: Every installed `calendar-29` block.
Impact [S]: Clicking the label does not focus the input and assistive technology gets no label association; multiple instances share `id="date"`.

## Evidence

- [S] `docs/src/lib/registry/blocks/calendar-29.svelte:36` — `<Label for="{id}-date">`.
- [S] `docs/src/lib/registry/blocks/calendar-29.svelte:39` — `id="date"`.
- [O] `shadcn-ui/ui` `apps/v4/public/r/styles/new-york/calendar-29.json` — `htmlFor="date"` with `id="date"`, so the mismatch is port-specific.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "calendar-29"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2732` — Related; touches `calendar-29.svelte` but not the label or input id.

Contribution fit: New issue — a direct PR may suit maintainers better; target remains a user decision.

## Proposed-Change

Give the input `id="{id}-date"`.

## Scope-and-Constraints

- Preserve: `calendar-28` and other blocks using `$props.id()`.
- Exclude: block layout.
- Cost: one attribute.

## Verification

- Click the "Schedule Date" label → input receives focus.

## Publication-Blockers

- [O] StackBlitz reproduction.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a `calendar-29` reproduction, click the label, and record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `calendar-29` block: label `for` doesn't match the input id

Body:

````markdown
### Describe the bug

In `calendar-29.svelte`, the label uses `for="{id}-date"` (with `const id = $props.id()`), but the input has the static `id="date"`. Clicking "Schedule Date" doesn't focus the input, the input has no accessible label, and two instances on a page share `id="date"`.

**Possible fix:** set the input's id to `{id}-date`.

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
