# ISSUE-061 — cli/apply: positional preset prints `Applied preset undefined`

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

Root-Cause [S]: `apply` resolves the positional preset into `providedPreset`, but the status message prints `options.preset`, which is undefined for the positional form.

## Reach-and-Impact

Reach [S]: `shadcn-svelte apply <preset>` without `--preset`.
Impact [O]: Cosmetic; the command succeeds but prints `Applied preset undefined to config file`.

## Evidence

- [S] `packages/cli/src/commands/apply/index.ts:61` — `providedPreset = options.preset || preset`.
- [S] `packages/cli/src/commands/apply/index.ts:125` — `` loader.stop(`Applied preset ${color.bold(options.preset)} to config file`) ``.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: `apply b0 --only theme` printed `Applied preset undefined to config file`, then `Preset b0 applied successfully.`
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/apply-preset-undefined.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "Applied preset undefined"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue, or a typo-sized fix without an issue if the user later chooses a PR.

## Proposed-Change

Pass the resolved preset into `runApply` and print it.

## Scope-and-Constraints

- Preserve: `--preset` form.
- Exclude: other messages.
- Cost: one line.

## Verification

- `apply b0` prints `Applied preset b0 to config file`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `apply b0` prints "Applied preset undefined to config file"

Body:

````markdown
### Describe the bug

With the positional form (`apply b0`), the preset is resolved into `providedPreset`, but the message in `runApply` uses `options.preset`, which is only set by `--preset`. The command works, it just prints:

```text
Applied preset undefined to config file
...
Preset b0 applied successfully.
```

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/apply-preset-undefined.sh

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
