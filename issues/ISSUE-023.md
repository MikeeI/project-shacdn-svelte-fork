# ISSUE-023 — registry/ui/sonner: remixicon error and warning icons are swapped

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

Root-Cause [S]: `sonner.svelte` maps `errorIcon` to `RiErrorWarningLine` and `warningIcon` to `RiCloseCircleLine`, the reverse of shadcn/ui.

## Reach-and-Impact

Reach [S]: Projects with `iconLibrary: remixicon`.
Impact [S]: `toast.error` shows the warning glyph and `toast.warning` shows the close-circle glyph.

## Evidence

- [S] `docs/src/lib/registry/ui/sonner/sonner.svelte:46` — errorIcon `remixicon="RiErrorWarningLine"`.
- [S] `docs/src/lib/registry/ui/sonner/sonner.svelte:66` — warningIcon `remixicon="RiCloseCircleLine"`.
- [O] `shadcn-ui/ui` `apps/v4/registry/bases/base/ui/sonner.tsx` — warning `RiErrorWarningLine`, error `RiCloseCircleLine`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "sonner remixicon"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — a direct PR may suit maintainers better; publication target remains a user decision.

## Proposed-Change

Swap the two `remixicon` values.

## Scope-and-Constraints

- Preserve: other icon libraries.
- Exclude: sonner styling.
- Cost: two attributes.

## Verification

- `iconLibrary: remixicon` → `toast.error` shows the close-circle icon, `toast.warning` the warning icon.

## Publication-Blockers

- Reproduction link with remixicon, required by `3-bug_report.yml`.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a remixicon reproduction that triggers both toasts and record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Sonner: remixicon error and warning icons are swapped

Body:

````markdown
### Describe the bug

In `ui/sonner/sonner.svelte`, the `errorIcon` snippet uses `remixicon="RiErrorWarningLine"` and the `warningIcon` snippet uses `remixicon="RiCloseCircleLine"`. shadcn/ui maps them the other way round (warning → `RiErrorWarningLine`, error → `RiCloseCircleLine`), and the other icon libraries in the same file follow that too. With `iconLibrary: "remixicon"`, `toast.error` shows the warning glyph and `toast.warning` shows the X glyph.

**Possible fix:** swap the two `remixicon` values.

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
