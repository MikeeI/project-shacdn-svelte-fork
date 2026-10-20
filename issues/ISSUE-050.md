# ISSUE-050 — parity: `fix` copies tokens from a `parity-ignore` fragment into the patched fragment

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: Medium
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `fix` computes the new class string from the merged class list of all fragments, including ignored ones, and writes the result into the first editable fragment.

## Reach-and-Impact

Reach [S]: Maintainers running `pnpm parity fix` on items with `// parity-ignore` fragments.
Impact [O]: The ignored token is duplicated into the patched fragment, so the fix silently changes the ignored styling's location and can double it.

## Evidence

- [S] `packages/parity/src/compare.ts:989,995,1019-1021` — merged tokens drive the patch target string.
- [O] `97fdb93`, Node 26.12.0: ours `"flex items-center gap-2 p-2"` plus ignored `"text-red-500"`, upstream `flex items-center gap-2 p-4`; `fix button --dry-run` printed `+ flex items-center gap-2 text-red-500 p-4`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/fix-copies-ignored-fragment.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "parity"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2876` — Related; introduced the parity CLI.
- `https://github.com/huntabyte/shadcn-svelte/pull/2909` — Distinct; separate parity docs CLI draft.

Contribution fit: New issue — maintainer tooling; low reach, concrete wrong output.

## Proposed-Change

Exclude tokens owned by ignored fragments from the computed replacement.

## Scope-and-Constraints

- Preserve: `fix` on items without ignored fragments.
- Exclude: compare reporting.
- Cost: filter before diffing.

## Verification

- Reproduction script → dry run prints `+ flex items-center gap-2 p-4`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: parity: `fix` copies classes from a `parity-ignore` fragment into the patched one

Body:

````markdown
### Describe the bug

`pnpm parity fix` builds the replacement from all class fragments of a `cn(...)` call, including the one marked `// parity-ignore`, and writes it into the editable fragment.

Ours:

```svelte
cn(
  "flex items-center gap-2 p-2",
  // parity-ignore: preserve this local typography
  "text-red-500"
)
```

Upstream is `flex items-center gap-2 p-4`. The dry run wants to write:

```text
- flex items-center gap-2 p-2
+ flex items-center gap-2 text-red-500 p-4
```

Expected: `flex items-center gap-2 p-4`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/fix-copies-ignored-fragment.sh

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
