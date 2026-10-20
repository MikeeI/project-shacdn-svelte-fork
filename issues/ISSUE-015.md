# ISSUE-015 — cli: JavaScript projects overwrite existing `.js` files without the overwrite prompt

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
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `addRegistryItems` checks for existing files at the untransformed `.ts` path, while `transformStripTypes` later writes the `.js` path for `typescript: false` projects.

## Reach-and-Impact

Reach [S]: JavaScript projects for items whose files are only `.ts` or `.svelte.ts`, including `utils` and hook items.
Impact [S]: Customized `utils.js` or hook files are replaced without the overwrite prompt, and `skipExisting` in `apply` and `init` does not skip them.

## Evidence

- [S] `packages/cli/src/utils/add-registry-items.ts:92-95` — `existsSync(resolveItemFilePath(...))`.
- [S] `packages/cli/src/utils/registry/index.ts:239-243` — `utils` resolves to `${utils}.ts` without an extension.
- [S] `packages/cli/src/utils/transformers/transform-strip-types.ts:17-19` — rewrites `.ts` to `.js` after the check.
- [S] `packages/cli/src/utils/add-registry-items.ts:102-142` — prompts only for names in `existingItems`.
- [O] `shadcn-svelte@1.7.0`, `sv@1.1.1` JSDoc project, Node 26.12.0: re-running `init --preset b0` replaced an edited `src/lib/utils.js` with `export { cn } from "cn";` without an overwrite prompt; `add is-mobile --yes` likewise replaced an edited `src/lib/hooks/is-mobile.svelte.js`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/js-overwrite-without-prompt.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "typescript false overwrite utils"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — the existence check owns overwrite protection.

## Proposed-Change

Apply the same `.ts` → `.js` mapping to the existence-check path when `config.typescript` is false.

## Scope-and-Constraints

- Preserve: TypeScript project behavior and `--overwrite`.
- Exclude: the prompt flow itself.
- Cost: small change at one check.

## Verification

- JS fixture with edited `src/lib/utils.js` → `shadcn-svelte add button` → overwrite prompt lists `utils`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue via `3-bug_report.yml`; Severity `annoyance`; the disclosure sits in the first field because the form ends with a dropdown.
Title: JS projects: `add` overwrites an existing `utils.js` and hooks without asking

Body:

````markdown
### Describe the bug

With `"typescript": false`, `addRegistryItems` decides whether an item already exists via `existsSync(resolveItemFilePath(...))`, which returns the registry's `.ts` path (e.g. `src/lib/utils.ts`, `is-mobile.svelte.ts`). The file is only renamed to `.js` later by `transformStripTypes`. So an existing `utils.js` or hook is never detected, the overwrite prompt is skipped, and `skipExisting` (used by `apply`/`init`) doesn't apply. A customized `cn` in `utils.js` is silently replaced on the next `add`.

**Suggested fix:** use the same `.ts` → `.js` mapping for the existence check when `typescript` is false.

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/js-overwrite-without-prompt.sh

1. JS SvelteKit project (`sv create --types jsdoc`), `init --preset b0`, so `components.json` has `"typescript": false`.
2. Replace `src/lib/utils.js` with your own content and run `init --preset b0` again: no overwrite prompt, and `utils.js` becomes `export { cn } from "cn";` again.
3. Same for `src/lib/hooks/is-mobile.svelte.js` with `add is-mobile --yes`.

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
````
