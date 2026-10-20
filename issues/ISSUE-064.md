# ISSUE-064 — cli/transformers: menu and font class transforms skip markup inside `{#if}`/`{#each}` blocks

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

Root-Cause [S]: The template walkers in `transform-menu.ts` and `transform-font.ts` only descend into `node.fragment.nodes` or `node.nodes`, but Svelte block nodes keep children in `consequent`, `alternate`, `body`, and similar fragments.

## Reach-and-Impact

Reach [S]: Registry items that put `cn-menu-target`/`cn-menu-translucent` or font classes inside blocks.
Impact [O]: Markers inside blocks stay in the installed file, e.g. `cn-menu-target` remains as an unknown class.
Reach [A]: Official registry items were not checked for markers inside blocks.

## Evidence

- [S] `packages/cli/src/utils/transformers/transform-menu.ts:51-56` — `walkNodes` recursion.
- [S] `packages/cli/src/utils/transformers/transform-font.ts:216-227` — same recursion in `walkSvelteTemplate`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: item with `cn-menu-target p-2` at top level and `cn-menu-target p-4` inside `{#if open}` → top-level marker removed, `class="cn-menu-target p-4"` unchanged.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry
- [S] Font half not run; it shares the recursion shape.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "cn-menu-target"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — one traversal defect copied into two transformers.

## Proposed-Change

Use `svelte`'s `walk` (zimmerframe) or descend into all fragment-bearing properties in both walkers.

## Scope-and-Constraints

- Preserve: top-level behavior.
- Exclude: script-side class strings.
- Cost: shared walker or a few extra properties.

## Verification

- Reproduction → both markers transformed.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `cn-menu-target` inside `{#if}` blocks is not transformed on install

Body:

````markdown
### Describe the bug

The template walker in `transform-menu.ts` only recurses into `node.fragment.nodes` / `node.nodes`. Block nodes like `{#if}` keep their children in `consequent` / `alternate` (and `{#each}` in `body`), so markers inside blocks are never visited. `transform-font.ts` has the same walker.

For an item with `class="cn-menu-target p-2"` on a top-level `div` and `class="cn-menu-target p-4"` on a `div` inside `{#if open}`, `add` removes the first marker and keeps the second one.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "`cn-menu-target` is only replaced outside `{#if}` blocks")

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
