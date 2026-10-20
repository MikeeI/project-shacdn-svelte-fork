# ISSUE-025 — cli/update: item `css` and `cssVars` are never applied

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `update` merges item `css`/`cssVars` inside file tasks, but decides whether to add the stylesheet task before those tasks run.

## Reach-and-Impact

Reach [S]: `update` for registry items that declare `css` or `cssVars`, mainly custom registries.
Impact [S]: Their stylesheet changes are dropped unless fonts also contribute CSS.

## Evidence

- [S] `packages/cli/src/commands/update/index.ts:228-233` — merge inside the task.
- [S] `packages/cli/src/commands/update/index.ts:271` — gate on `cssVars`/`css` keys.
- [S] `packages/cli/src/commands/update/index.ts:289` — `await p.tasks(tasks)` runs afterwards.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "update cssVars"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `update` owns the ordering.

## Proposed-Change

Always push the stylesheet task and check for non-empty CSS inside it, or merge item CSS before building tasks.

## Scope-and-Constraints

- Preserve: font CSS handling.
- Exclude: `add` flow.
- Cost: small reordering.

## Verification

- Custom item with `cssVars` → `update <item>` → stylesheet contains the vars.

## Publication-Blockers

- [O] Reproduction with a custom item declaring `cssVars`.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Serve a custom item with `cssVars`, run `update`, and record the unchanged stylesheet, repository URL, and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed CSS, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `update` never applies an item's `css`/`cssVars`

Body:

````markdown
### Describe the bug

In `commands/update/index.ts`, each item's `css` and `cssVars` are merged inside the async file task, but the `if (Object.keys(cssVars).length > 0 || Object.keys(css).length > 0)` check that adds the "Updating stylesheet" task runs before `p.tasks(tasks)` executes them. At that point only font CSS can be present, so items with `css`/`cssVars` (e.g. from custom registries) never update the stylesheet through `update`, while `add` handles them.

**Possible fix:** always add the stylesheet task and check for empty CSS inside it, or merge item CSS before the tasks are built.

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
