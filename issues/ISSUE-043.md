# ISSUE-043 — cli/registry build: `--cwd` resolves `registry.json` but reads item files from the process directory

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `registry build` resolves the registry file and dependencies against `options.cwd`, but reads each `file.path` relative to `process.cwd()`.

## Reach-and-Impact

Reach [S]: `registry build --cwd <dir>` invoked from another directory, e.g. monorepo root scripts.
Impact [O]: The build fails with `ENOENT`, or silently bundles a different file when the same relative path exists in the process directory.

## Evidence

- [S] `packages/cli/src/commands/registry/build.ts:97` — `resolveProjectDeps(options.cwd)`.
- [S] `packages/cli/src/commands/registry/build.ts:128` — `fs.readFile(file.path, "utf8")` without `options.cwd`.
- [O] `shadcn-svelte@1.7.0` and `97fdb93`, Node 26.12.0: `registry build registry.json --cwd demo --output static/r` from the parent bundled the parent's `src/card.svelte` (`origin = "parent"`) instead of `demo/src/card.svelte`; without the parent file it fails with `ENOENT: no such file or directory, open 'src/card.svelte'`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-cwd-reads-parent-files.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry build" and `cwd`; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2632` — Related (weak); parallelized the docs registry build.
- No report of `--cwd` path resolution.

Contribution fit: New issue — `registry build` owns path resolution.

## Proposed-Change

Read item files from `path.resolve(options.cwd, file.path)`.

## Scope-and-Constraints

- Preserve: builds run from the registry directory.
- Exclude: output path handling.
- Cost: one path join.

## Verification

- Reproduction script → `card.json` contains `origin = "project"`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `registry build --cwd` reads item files relative to the current directory

Body:

````markdown
### Describe the bug

`registry build --cwd demo` finds `demo/registry.json`, but item files are read with `fs.readFile(file.path)` in `commands/registry/build.ts`, so they're resolved from the directory the command runs in, not from `--cwd`. The build either fails with `ENOENT`, or bundles the wrong file if the same relative path exists in the current directory.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-cwd-reads-parent-files.sh

Both `src/card.svelte` and `demo/src/card.svelte` exist. Running `registry build registry.json --cwd demo` from the parent puts the parent's `src/card.svelte` into `demo/static/r/card.json`.

### Logs

Without the parent file:

```text
└  Error: ENOENT: no such file or directory, open 'src/card.svelte'
```

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
  shadcn-svelte: 1.7.0 (npx)
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
