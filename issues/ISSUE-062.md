# ISSUE-062 — cli/update: unknown component names silently fall back to the interactive picker

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

Root-Cause [S]: `update` filters the requested names against installed items and, when none match, treats the call as if no names were given and opens the multiselect, even with `--yes`.

## Reach-and-Impact

Reach [S]: `update` with misspelled or not-installed names, and scripted runs with `--yes`.
Impact [O]: No error is reported; non-interactive runs block on a prompt.

## Evidence

- [S] `packages/cli/src/commands/update/index.ts:106-111` — unmatched names leave `selectedComponents` empty.
- [S] `packages/cli/src/commands/update/index.ts:114-118` — empty selection opens `p.multiselect`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: `update does-not-exist --yes --no-deps` opened `Which components would you like to update?` listing `utils`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/update-unknown-name-opens-picker.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "update component not found"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `update` owns argument validation.

## Proposed-Change

When names are given, report the unmatched ones and exit non-zero instead of prompting.

## Scope-and-Constraints

- Preserve: picker when no names are given.
- Exclude: `--all`.
- Cost: small.

## Verification

- Reproduction → error naming `does-not-exist`, non-zero exit.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `update` with an unknown component name opens the picker instead of failing

Body:

````markdown
### Describe the bug

`update does-not-exist --yes` doesn't report that the component isn't installed. Requested names are filtered against installed items, and if none match, `update` behaves as if no names were passed and opens `Which components would you like to update?`. With `--yes` in a script this blocks on the prompt.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/update-unknown-name-opens-picker.sh

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
