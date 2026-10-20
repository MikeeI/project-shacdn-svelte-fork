# ISSUE-025 — cli/update: item `css` and `cssVars` are never applied

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
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `update` merges item `css`/`cssVars` inside file tasks, but decides whether to add the stylesheet task before those tasks run.

## Reach-and-Impact

Reach [S]: `update` for registry items that declare `css` or `cssVars`, mainly custom registries.
Impact [S]: Their stylesheet changes are dropped unless fonts also contribute CSS.

## Evidence

- [S] `packages/cli/src/commands/update/index.ts:228-233` — merge inside the task.
- [S] `packages/cli/src/commands/update/index.ts:271` — gate on `cssVars`/`css` keys.
- [S] `packages/cli/src/commands/update/index.ts:289` — `await p.tasks(tasks)` runs afterwards.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0, custom registry via `COMPONENTS_REGISTRY_URL`: `add e2card` wrote `--e2`; after the served item gained `cssVars.light["e2-new"]`, `update e2card --yes --no-deps` printed `Success! Component update completed.` but `layout.css` still had only `--e2` and `--color-e2`; `add e2card --overwrite` against the same item writes `--e2-new`.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "update cssVars"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `update` owns the ordering.

## Proposed-Change

Always push the stylesheet task and check for non-empty CSS inside it, or merge item CSS before building tasks.

## Scope-and-Constraints

- Preserve: font CSS handling.
- Exclude: `add` flow.
- Cost: small reordering.

## Verification

- Custom item with `cssVars` → `update <item>` → stylesheet contains the vars.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `update` never applies an item's `css`/`cssVars`

Body:

````markdown
### Describe the bug

In `commands/update/index.ts`, each item's `css` and `cssVars` are merged inside the async file task, but the `if (Object.keys(cssVars).length > 0 || Object.keys(css).length > 0)` check that adds the "Updating stylesheet" task runs before `p.tasks(tasks)` executes them. At that point only font CSS can be present, so items with `css`/`cssVars` (e.g. from custom registries) never update the stylesheet through `update`, while `add` handles them.

**Possible fix:** always add the stylesheet task and check for empty CSS inside it, or merge item CSS before the tasks are built.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "`update` ignores `cssVars` of changed items")

1. `add e2card` from `registry/`: `layout.css` gets `--e2`.
2. `update e2card --yes` from `registry-v2/`, where the item adds `cssVars.light["e2-new"]`: prints `Success! Component update completed.`, but `--e2-new` is not written.
3. `add e2card --overwrite` from `registry-v2/` does write `--e2-new` and `--color-e2-new`.

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
