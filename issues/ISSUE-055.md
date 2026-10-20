# ISSUE-055 — cli/css: string `css` values are appended again on every install

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: For string rule bodies, `processRule` appends every parsed declaration without checking for an existing declaration, unlike the object branch.

## Reach-and-Impact

Reach [S]: Items whose `css` rules use string bodies, on every `add --overwrite` or reinstall.
Impact [O]: Declarations accumulate in the stylesheet on each run.

## Evidence

- [S] `packages/cli/src/utils/updaters/update-css.ts:514-518` — object branch replaces an existing declaration.
- [S] `packages/cli/src/utils/updaters/update-css.ts:527-543` — string branch always calls `rule?.append(clone)`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: item with `css: { "@layer base": { "h1": "font-size: 2rem" } }`; two `add --overwrite` runs → `h1 { font-size: 2rem; font-size: 2rem; }`.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "css duplicate" and "registry css"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `update-css` owns idempotency.

## Proposed-Change

Use the same replace-or-append logic for declarations parsed from a string.

## Scope-and-Constraints

- Preserve: object-form rules.
- Exclude: non-declaration nodes in string bodies.
- Cost: reuse existing lookup.

## Verification

- Two installs → one `font-size` declaration.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `css` rules written as strings are duplicated on every `add --overwrite`

Body:

````markdown
### Describe the bug

If an item's `css` uses a string as the rule body (`"h1": "font-size: 2rem"`), `processRule` in `update-css.ts` appends the declarations every time. The object form replaces existing declarations, the string form doesn't. After two `add --overwrite` runs:

```css
h1 {
	font-size: 2rem;
	font-size: 2rem;
}
```

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "String `css` values are appended again on every `add --overwrite`")

### System Info

```text
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
  CPU: (32) x64 AMD Ryzen 9 5950X 16-Core Processor
  Shell: 5.2.21 - /bin/bash
Binaries:
  Node: 26.12.0 - /usr/bin/node
  npm: 12.2.0 - /usr/bin/npm
  pnpm: 10.32.1 - /usr/bin/pnpm
npmPackages:
  @lucide/svelte: ^1.60.0 => 1.60.0
  @sveltejs/kit: ^3.0.0 => 3.1.0
  shadcn-svelte: ^1.7.0 => 1.7.0
  svelte: ^5.57.1 => 5.57.2
  tailwindcss: ^4.3.0 => 4.3.3
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
