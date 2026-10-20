# ISSUE-054 — cli/css: `cssVars` keys with a leading `--` produce `var(----name)` in `@theme inline`

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

Root-Cause [S]: The theme updater strips a leading `--` from the property name but not from the `var(--${variable})` value.

## Reach-and-Impact

Reach [S]: Registry items whose `cssVars` keys include `--`, mainly custom registries.
Impact [O]: The generated `--color-*` mapping references an undefined variable, so the utility (e.g. `bg-brand`) has no color.

## Evidence

- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:207-210` — `prop` uses `variable.replace(/^--/, "")`.
- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:215` — `propValue = var(--${variable})` without stripping.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: item with `cssVars.light["--brand"]` → `layout.css` contains `--brand: oklch(0.5 0.1 200);` and `--color-brand: var(----brand);`.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "cssVars" and "var(----"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — the code already accepts `--` keys for the property name, so the value mismatch is a bug, not unsupported input.

## Proposed-Change

Normalize `variable` once (`variable.replace(/^--/, "")`) and use it for both property and value.

## Scope-and-Constraints

- Preserve: keys without `--`.
- Exclude: schema changes.
- Cost: one line.

## Verification

- Reproduction → `--color-brand: var(--brand);`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `cssVars` keys starting with `--` produce `var(----name)`

Body:

````markdown
### Describe the bug

For a `cssVars` key like `"--brand"`, `update-css-vars.ts` strips the leading `--` for the theme property but not for its value. The result is:

```css
--brand: oklch(0.5 0.1 200);
--color-brand: var(----brand);
```

so `bg-brand` has no color.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "`cssVars` keys with a leading `--` produce `var(----name)`")

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
