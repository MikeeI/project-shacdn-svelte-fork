# ISSUE-052 — parity: arbitrary `calc()` normalization rewrites hyphens inside custom property names

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

Root-Cause [S]: `toTailwindArbitraryCalc` spaces every `-` that follows a word character, including hyphens inside `var(--name)` identifiers.

## Reach-and-Impact

Reach [S]: Parity comparisons and `fix` writes for classes with `calc()` arbitrary values that reference custom properties, e.g. sidebar widths.
Impact [O]: `fix` would write `var(--sidebar_-_width)`, an undefined property, into source.

## Evidence

- [S] `packages/parity/src/compare.ts:289-297` — `.replace(/(?<=[\w%)])\s*([+*/-])\s*(?=\S)/g, " $1 ")`.
- [O] `97fdb93`, Node 26.12.0: `toSourceToken("w-[calc(var(--sidebar-width)+2rem)]")` → `w-[calc(var(--sidebar_-_width)_+_2rem)]`; `fixClassString` produces the same mangled token.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/calc-mangles-custom-properties.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "parity"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2876` — Related; introduced the parity CLI.

Contribution fit: New issue — the normalizer can write broken CSS.

## Proposed-Change

Skip operators inside `var(...)` or require whitespace or a closing paren before `-`.

## Scope-and-Constraints

- Preserve: spacing normalization for real operators.
- Exclude: other arbitrary value functions.
- Cost: regex change.

## Verification

- Reproduction script → `w-[calc(var(--sidebar-width)_+_2rem)]`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: parity: `calc()` normalization breaks `var(--custom-property)` names

Body:

````markdown
### Describe the bug

`toTailwindArbitraryCalc` in `packages/parity/src/compare.ts` adds spaces around every `-` after a word character. That includes the hyphens in custom property names, so `parity fix` would write an undefined variable.

```text
{"input":"w-[calc(var(--sidebar-width)+2rem)]","output":"w-[calc(var(--sidebar_-_width)_+_2rem)]"}
{"input":"h-[calc(100vh-var(--header-height))]","output":"h-[calc(100vh_-_var(--header_-_height))]"}
```

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/calc-mangles-custom-properties.sh

### System Info

```text
huntabyte/shadcn-svelte@97fdb93, node packages/parity/src/index.ts
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
Binaries:
  Node: 26.12.0 - /usr/bin/node
  pnpm: 10.32.1 - /usr/bin/pnpm
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
