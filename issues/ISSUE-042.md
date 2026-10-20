# ISSUE-042 — cli/transformers: two `IconPlaceholder`s with the same icon emit a duplicate import

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

Root-Cause [S]: `transformIcons` pushes one import per `IconPlaceholder` occurrence and writes all of them without deduplicating by icon name.

## Reach-and-Impact

Reach [S]: Registry items that use the same `IconPlaceholder` icon more than once in one file.
Reach [S]: No installable item in the official registry is affected; 51 files under `docs/src/lib/registry/examples/create/` repeat an icon but are not served as CLI items.
Impact [O]: The installed component has two identical default imports and fails to compile.

## Evidence

- [S] `packages/cli/src/utils/transformers/transform-icons.ts:55` — `icons.push({ name: iconName })` per placeholder.
- [S] `packages/cli/src/utils/transformers/transform-icons.ts:72-74` — one `import` line per pushed icon.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: `add` of a custom item with two `IconPlaceholder lucide="CheckIcon"` wrote `import CheckIcon from '@lucide/svelte/icons/check';` twice; compiling fails with `Identifier 'CheckIcon' has already been declared`.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "IconPlaceholder" and "duplicate import icon"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found; #2584 and #2720 mention `IconPlaceholder` but are unrelated.

Contribution fit: New issue — the icon transformer owns import generation.

## Proposed-Change

Deduplicate `icons` by name before generating imports.

## Scope-and-Constraints

- Preserve: one import per distinct icon and the placeholder replacement itself.
- Exclude: other icon libraries' extra imports.
- Cost: a `Set` over icon names.

## Verification

- Item with two identical placeholders → `add` → one import, component compiles.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Using the same `IconPlaceholder` icon twice produces a duplicate import

Body:

````markdown
### Describe the bug

If a registry item uses the same icon twice through `IconPlaceholder`, `add` writes the import twice. `transformIcons` pushes one entry per placeholder and doesn't dedupe by name, so the component fails to compile with `Identifier 'CheckIcon' has already been declared`.

This only affects items that repeat an icon in one file, e.g. from a custom registry.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "Two `IconPlaceholder`s with the same icon produce a duplicate import")

```js
import CheckIcon from '@lucide/svelte/icons/check';
import CheckIcon from '@lucide/svelte/icons/check';
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
