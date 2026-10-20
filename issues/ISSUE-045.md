# ISSUE-045 — cli/update: installed items are detected only as directories, so flat hooks are never found

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

Root-Cause [S]: `project.getComponents` only treats directories whose name matches a registry item as installed, while hooks such as `is-mobile` install as single files.

## Reach-and-Impact

Reach [S]: `update` for hook items installed as files, and every caller of `getComponents`, including the `init` style-change reinstall list.
Impact [O]: `update is-mobile` does not find the installed hook and shows the selector without it.

## Evidence

- [S] `packages/cli/src/utils/project.ts:28-33` — `file.isDirectory()` gate before matching registry names.
- [S] `packages/cli/src/commands/update/index.ts:102-111` — `update` filters requested names against `getComponents`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0, JS project: after `add is-mobile`, the hook exists at `src/lib/hooks/is-mobile.svelte.js`; `update is-mobile --yes` opened `Which components would you like to update?` listing only `utils`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/update-misses-flat-hooks.sh
- [A] TypeScript projects behave the same because the check ignores files regardless of extension; not run.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "update hooks" and "is-mobile.svelte.js"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/1340` — Related (weak); introduced flat hooks.
- `https://github.com/huntabyte/shadcn-svelte/issues/1651` — Related (weak); `is-mobile` simplification.

Contribution fit: New issue — `getComponents` owns installed-item detection.

## Proposed-Change

Also match files by item target, e.g. strip `.svelte.ts`/`.svelte.js`/`.ts`/`.js` and compare with registry hook names.

## Scope-and-Constraints

- Preserve: directory-based UI detection.
- Exclude: `registry:file` items outside alias directories.
- Cost: one additional match branch.

## Verification

- Reproduction script → `update is-mobile --yes` updates the hook without opening the selector.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `update` doesn't find installed hooks like `is-mobile`

Body:

````markdown
### Describe the bug

`update is-mobile` doesn't detect the installed hook. `project.getComponents` only counts directories whose name matches a registry item, but hooks are installed as single files (`src/lib/hooks/is-mobile.svelte.js`). So `update is-mobile --yes` opens the selector, and `is-mobile` isn't in the list.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/update-misses-flat-hooks.sh

1. `init --preset b0`, then `add is-mobile`.
2. `update is-mobile --yes` shows `Which components would you like to update?` with only `utils`.

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
