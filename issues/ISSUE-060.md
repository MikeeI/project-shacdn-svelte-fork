# ISSUE-060 — cli/auto-detect: any path containing `.git` disables CSS auto-detection

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

Root-Cause [S]: `walkDir` skips a directory when its absolute path contains `node_modules`, `.git`, or `.svelte-kit` as a substring, so `user.github.io` matches `.git`.

## Reach-and-Impact

Reach [S]: Projects under any path containing those substrings, e.g. GitHub Pages repositories named `*.github.io`.
Impact [O]: `init` finds no CSS file and suggests `src/app.css` instead of the existing stylesheet.

## Evidence

- [S] `packages/cli/src/utils/auto-detect.ts:13` — `IGNORE = ["node_modules", ".git", ".svelte-kit"]`.
- [S] `packages/cli/src/utils/auto-detect.ts:72` — `IGNORE.some((name) => dirPath.includes(name))` on the absolute path.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: project at `$root/user.github.io/detect` with `src/routes/layout.css`; `init` without `--css` prompted `Where is your global CSS file?` with default `src/app.css`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/auto-detect-dot-git-substring.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "github.io css" and "global css not detected"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — small, concrete fix in the detection owner.

## Proposed-Change

Compare `file.name` (or path segments relative to `cwd`) against `IGNORE` instead of substring-matching the absolute path.

## Scope-and-Constraints

- Preserve: skipping real `node_modules`, `.git`, `.svelte-kit` directories.
- Exclude: `.gitignore` handling.
- Cost: one condition.

## Verification

- Reproduction → prompt defaults to `src/routes/layout.css`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: CSS auto-detection fails for projects under `*.github.io` directories

Body:

````markdown
### Describe the bug

`walkDir` in `utils/auto-detect.ts` skips directories with `IGNORE.some((name) => dirPath.includes(name))`, where `dirPath` is absolute. Any parent directory containing `.git`, like `user.github.io`, matches, so nothing is detected and `init` suggests `src/app.css` even though `src/routes/layout.css` exists.

Comparing the directory name instead of a substring of the full path would fix it.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/auto-detect-dot-git-substring.sh

Project in `user.github.io/detect` with `src/routes/layout.css`. `init` without `--css` asks `Where is your global CSS file?` with `src/app.css` as the default.

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
