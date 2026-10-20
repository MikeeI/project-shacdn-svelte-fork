# ISSUE-034 — registry/ui/field: `FieldError` shows duplicate messages that shadcn/ui deduplicates

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

Root-Cause [S]: `FieldError` renders the `errors` array as-is, while shadcn/ui deduplicates errors by message before choosing single or list output.

## Reach-and-Impact

Reach [O]: Fields whose schema emits the same message from several checks.
Impact [S]: The same message is rendered twice as a bullet list instead of once.

## Evidence

- [S] `docs/src/lib/registry/ui/field/field-error.svelte:32,50` — length checks and `{#each errors ...}` on the raw array.
- [O] `shadcn-ui/ui` `apps/v4/registry/new-york-v4/ui/field.tsx:203-205` — `new Map(errors.map((error) => [error?.message, error]))`.
- [O] Zod in the docs workspace: `min(1,"Invalid").email("Invalid")` on `""` → two `"Invalid"` issues.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "FieldError"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — parity gap; distinct from ISSUE-019, which owns the `FormFieldErrors` crash.

## Proposed-Change

Derive unique errors by message and use them for `hasContent`, the single-message branch, and the list.

## Scope-and-Constraints

- Preserve: `children` override and single-message rendering.
- Exclude: `FormFieldErrors`.
- Cost: one `$derived`.

## Verification

- `errors=[{message:"Invalid"},{message:"Invalid"}]` → one message, no list.

## Publication-Blockers

- [O] StackBlitz reproduction.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Render `Field.Error` with two identical messages in a reproduction and record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `Field.Error` renders duplicate messages (shadcn/ui deduplicates them)

Body:

````markdown
### Describe the bug

shadcn/ui's `FieldError` deduplicates errors by message (`new Map(errors.map((error) => [error?.message, error]))`) before deciding between a single message and a list. `field-error.svelte` uses the raw `errors` array, so `[{ message: "Invalid" }, { message: "Invalid" }]` renders a two-item list with the same text. This happens with real schemas, e.g. Zod `z.string().min(1, "Invalid").email("Invalid")` on an empty string.

**Possible fix:** derive the unique errors by message like shadcn/ui and use them for the content check, the single-message branch, and the list.

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
