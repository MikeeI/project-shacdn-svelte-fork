# ISSUE-021 — cli/apply: `--only theme font` skips installing font packages

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

Root-Cause [S]: `apply` computes `onlyApplyTheme` as `only?.includes("theme")`, which is also true when `font` is selected.

## Reach-and-Impact

Reach [S]: `shadcn-svelte apply <preset> --only theme font` (or `font theme`).
Impact [S]: Font CSS imports are written but `@fontsource-variable/*` is not installed, so the build cannot resolve the import.

## Evidence

- [S] `packages/cli/src/commands/apply/index.ts:107` — `const onlyApplyTheme = only?.includes("theme")`.
- [S] `packages/cli/src/commands/apply/index.ts:145-146` — comment "never install dependencies if only the theme is being applied", then `return`.
- [S] `packages/cli/src/commands/apply/index.ts:40` — `--only <parts...>` accepts `theme` and `font` together.
- [O] `shadcn-svelte@1.7.0`, SvelteKit 3.1.0, Node 26.12.0: after `init --preset b0`, `apply --preset bGW --only theme font` added `@import "@fontsource-variable/noto-sans";` to `layout.css`, but `package.json` gained no `@fontsource-variable/noto-sans`; exit status 0.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/apply-only-font-skips-deps.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "apply --only"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — rare trigger; `apply` owns the install decision.

## Proposed-Change

`const onlyApplyTheme = only?.length === 1 && only[0] === "theme"`.

## Scope-and-Constraints

- Preserve: `--only theme` still installs nothing.
- Exclude: base-item dependency gating for `--only font`.
- Cost: one line.

## Verification

- `apply <preset> --only theme font` → the font package appears in `package.json`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `apply --only theme font` writes the font import but doesn't install the font package

Body:

````markdown
### Describe the bug

In `commands/apply/index.ts`, `onlyApplyTheme` is `only?.includes("theme")`, and the command returns before `installDependencies` when it's true ("never install dependencies if only the theme is being applied"). With `--only theme font` it's also true, so the `@import "@fontsource-variable/..."` is added to the CSS but the package is never installed, and the build fails to resolve it.

**Possible fix:** `const onlyApplyTheme = only?.length === 1 && only[0] === "theme";`

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/apply-only-font-skips-deps.sh

After `init --preset b0`, `apply --preset bGW --only theme font` adds `@import "@fontsource-variable/noto-sans";` to the CSS, but `@fontsource-variable/noto-sans` is not added to `package.json`.

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
