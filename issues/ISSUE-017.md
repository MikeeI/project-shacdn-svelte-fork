# ISSUE-017 — cli/css: dark `@custom-variant` is skipped when any other `@custom-variant` exists

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `addCustomVariant` treats any top-level `@custom-variant` as the dark variant and skips inserting `dark (&:is(.dark *))`.

## Reach-and-Impact

Reach [S]: `init`, `add`, and `apply` on stylesheets that already define an unrelated `@custom-variant` before dark vars are written.
Impact [A]: `.dark` CSS variables follow the class while `dark:` utilities follow `prefers-color-scheme`, so class-based dark mode renders inconsistently.

## Evidence

- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:71-73` — finds any `custom-variant` at-rule by name only.
- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:6,23-27` — intended params `dark (&:is(.dark *))` when dark vars exist.
- [S] `packages/cli/src/tailwind.css` — defines data-state variants but no `dark` variant.
- [S] `shadcn-ui/ui` `packages/registry/src/updaters/update-css-vars.ts:513-520` — same name-only check; tracked separately as ISSUE-035.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "custom-variant dark"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2044` — Distinct; earlier missing dark-mode CSS for Tailwind v4, not this check.

Contribution fit: New issue — the CSS updater owns the dark variant insertion.

## Proposed-Change

Match only `custom-variant` rules whose params start with `dark`.

## Scope-and-Constraints

- Preserve: existing user-defined dark variants stay untouched.
- Exclude: other variant handling.
- Cost: one predicate change.

## Verification

- `transformCss` on `@import "tailwindcss";\n@custom-variant hocus (&:hover, &:focus);` with `cssVars.dark` → output contains `@custom-variant dark (&:is(.dark *));`.

## Publication-Blockers

- [O] Reproduction with a stylesheet containing another custom variant, as a repository link.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Run `init` on a project whose CSS has `@custom-variant hocus`, then record the missing dark variant, repository URL, and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed CSS, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: CLI doesn't add the `dark` custom variant when the stylesheet already has another `@custom-variant`

Body:

````markdown
### Describe the bug

`addCustomVariant` (`packages/cli/src/utils/updaters/update-css-vars.ts`) is supposed to add `@custom-variant dark (&:is(.dark *));` when dark CSS variables are written. It checks for an existing rule by name only (`node.name === "custom-variant"`), so any unrelated variant, e.g. `@custom-variant hocus (&:hover, &:focus);`, makes it skip the dark variant. The `.dark { ... }` variables are still written, but `dark:` utilities then follow `prefers-color-scheme` instead of the `.dark` class.

**Possible fix:** only treat a `custom-variant` rule as existing when its params start with `dark`.

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
