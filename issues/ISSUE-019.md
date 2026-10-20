# ISSUE-019 — registry/ui/form: `FormFieldErrors` throws on duplicate error messages

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `FormFieldErrors` keys its `{#each}` block by the error string, while the error array can contain identical messages.

## Reach-and-Impact

Reach [O]: Fields whose schema emits the same message from several checks, e.g. Zod `min(1, "Invalid").email("Invalid")` on an empty string.
Impact [S]: Svelte throws `each_key_duplicate` in development and production, so the field error rendering fails.

## Evidence

- [S] `docs/src/lib/registry/ui/form/form-field-errors.svelte:25` — `{#each errors as error (error)}`.
- [S] `svelte@5.54.0` `internal/client/dom/blocks/each.js:344-351` — non-DEV branch also calls `e.each_key_duplicate`.
- [S] `sveltekit-superforms` `dist/errors.js:33,63` — messages are pushed without deduplication.
- [O] Zod in the docs workspace: `z.string().min(1,"Invalid").email("Invalid")` on `""` → two issues `["email","Invalid"]`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "each_key_duplicate form errors" and "FieldErrors duplicate"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — the component owns the each key.

## Proposed-Change

Key by index, or deduplicate messages before rendering.

## Scope-and-Constraints

- Preserve: rendering of every distinct message and the `children` snippet override.
- Exclude: `FieldError` deduplication (ISSUE-034).
- Cost: one line.

## Verification

- Superforms field with two checks sharing one message → submit empty → no `each_key_duplicate`, message visible.

## Publication-Blockers

- [O] Runnable superforms reproduction showing the thrown error.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Create a superforms form with duplicate messages, capture the runtime error, and record the link and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed error, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `Form.FieldErrors` throws `each_key_duplicate` when a field has two identical error messages

Body:

````markdown
### Describe the bug

`form-field-errors.svelte` renders errors with `{#each errors as error (error)}`, i.e. keyed by the message. Error arrays can contain the same message twice. For example, Zod's `z.string().min(1, "Invalid").email("Invalid")` reports two `"Invalid"` issues for an empty string, and superforms pushes both into the field's errors. Svelte then throws `each_key_duplicate`, and since Svelte 5's non-dev build throws too, it also breaks in production.

**Possible fix:** key by index (`{#each errors as error, i (i)}`), or deduplicate the messages before rendering.

### Reproduction

Pending: repository link.

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
