# ISSUE-051 — parity: class extraction drops strings with negative or unlisted utilities

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

Root-Cause [S]: `isClassToken` recognizes utilities through a fixed prefix allowlist anchored at the start, so negative utilities (`-ms-4`) and unlisted ones (`flex-col`, `aspect-video`, `object-cover`) fail, and `looksLikeClassList` drops strings below a 60% match ratio.

## Reach-and-Impact

Reach [S]: Every parity comparison of components that use such class strings.
Impact [O]: Real differences are invisible: `base carousel` reports 100% while its `-ms-4`/`-mt-4 flex-col` strings are never compared, and `--check` passes for `-ms-4` vs upstream `-ms-8`.

## Evidence

- [S] `packages/parity/src/compare.ts:468-469` — single-token and 60% ratio gates.
- [S] `packages/parity/src/compare.ts:480` — anchored prefix allowlist without a leading `-`.
- [O] `97fdb93`, Node 26.12.0: `extractClassStrings` returns `[]` for `className="-ms-4"` and `className="-mt-4 flex-col"`.
- [O] Fixture `-ms-4` vs upstream `-ms-8`: `base button --check` reports 100%, exit 0.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/extract-drops-negative-utilities.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "parity"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2876` — Related; introduced the parity CLI.
- `https://github.com/huntabyte/shadcn-svelte/pull/2883` — Related (weak); adds a missing check.

Contribution fit: New issue — false parity results undermine the checker's purpose.

## Proposed-Change

Accept an optional leading `-` and broaden token recognition, e.g. by matching any `[a-z-]+(-[\w./[\]]+)?` utility shape instead of a fixed prefix list.

## Scope-and-Constraints

- Preserve: rejection of non-class strings such as CSS selectors.
- Exclude: Tailwind config-aware validation.
- Cost: heuristic change with false-positive risk; needs the existing parity tests.

## Verification

- Reproduction script → `-ms-4` is extracted and the `-ms-8` fixture fails `--check`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: parity: class strings like `-ms-4` or `-mt-4 flex-col` are never compared

Body:

````markdown
### Describe the bug

`isClassToken` in `packages/parity/src/compare.ts` only accepts tokens that start with one of the listed prefixes. Negative utilities like `-ms-4` and utilities that aren't listed (`flex-col`, `aspect-video`, `object-cover`) don't match, so `extractClassStrings` skips those strings.

Because of that, `base carousel` reports 100% although its `-ms-4` / `-mt-4 flex-col` strings are never checked. A fixture with `-ms-4` on our side and `-ms-8` upstream also passes `--check`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/extract-drops-negative-utilities.sh

```text
{"input":"-ms-4","extracted":[]}
{"input":"-mt-4 flex-col","extracted":[]}
```

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
