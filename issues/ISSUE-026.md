# ISSUE-026 — cli: type stripping replaces the first `.ts` anywhere in the absolute path

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

Root-Cause [S]: `transformStripTypes` and `update` use `filePath.replace(".ts", ".js")` on absolute paths instead of replacing only the extension.

## Reach-and-Impact

Reach [S]: JavaScript projects whose absolute path contains `.ts` before the file name, e.g. `~/learn.ts-notes/app`.
Impact [S]: Files are written to a different directory outside the project, with the `.ts` name kept.

## Evidence

- [S] `packages/cli/src/utils/transformers/transform-strip-types.ts:17-19` — `filePath.replace(".ts", ".js")`.
- [S] `packages/cli/src/utils/add-registry-items.ts:196-201` — `mkdir` and `writeFile` use the returned path.
- [S] `packages/cli/src/commands/update/index.ts:239-241` — same replace when computing stale files.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: JS project at `$root/my.tsapp`, `init --preset b0` printed `utils installed at src/lib/utils` and `Success!`, but `my.tsapp/src/lib/utils.js` was absent and `$root/my.jsapp/src/lib/utils.ts` was created with `export { cn } from "cn";`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/strip-types-path-replace.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "strip types .js path"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — rare trigger; one-line fix.

## Proposed-Change

Use `filePath.replace(/\.ts$/, ".js")` in both places.

## Scope-and-Constraints

- Preserve: `.svelte.ts` → `.svelte.js`.
- Exclude: sucrase handling of non-code files.
- Cost: two lines.

## Verification

- JS project under `/tmp/a.ts-dir/app` → `add utils` → `src/lib/utils.js` inside the project.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: JS projects: `.ts` → `.js` rename replaces the first `.ts` in the absolute path

Body:

````markdown
### Describe the bug

For `"typescript": false`, `transformStripTypes` renames files with `filePath.replace(".ts", ".js")`. `filePath` is absolute, so this replaces the first `.ts` anywhere in the path. For a JS project in `/tmp/x/my.tsapp`, `init` prints `utils installed at src/lib/utils`, but writes `/tmp/x/my.jsapp/src/lib/utils.ts`, outside the project and still named `.ts`. `update` has the same `replace` when it computes file names.

**Possible fix:** `filePath.replace(/\.ts$/, ".js")` in both places.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/strip-types-path-replace.sh

1. Create a JSDoc SvelteKit project in a directory named `my.tsapp`.
2. Run `init --preset b0`: it reports success, `my.tsapp/src/lib/utils.js` does not exist, and `../my.jsapp/src/lib/utils.ts` was created.

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
