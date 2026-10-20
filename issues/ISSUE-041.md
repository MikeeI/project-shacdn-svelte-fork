# ISSUE-041 — cli/init: `--base-color` is accepted but ignored

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

Root-Cause [S]: `init` declares and validates `--base-color`, but builds `tailwind.baseColor` only from the decided preset and never reads `options.baseColor`.

## Reach-and-Impact

Reach [S]: Every `init` run that passes `--base-color`, including scripted setups copied from older docs.
Impact [O]: The command succeeds and silently writes the preset's base color instead of the requested one.

## Evidence

- [S] `packages/cli/src/commands/init/index.ts:28` — `baseColor: z.string().optional()` in the options schema.
- [S] `packages/cli/src/commands/init/index.ts:58-60` — `--base-color <name>` with the registry base colors as choices.
- [S] `packages/cli/src/commands/init/index.ts:226` — `baseColor: decidedPresets.baseColor`.
- [O] `shadcn-svelte@1.7.0`, SvelteKit 3.1.0, Node 26.12.0: `init --preset b0 --base-color zinc ...` succeeded and wrote `"baseColor": "neutral"`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/init-base-color-ignored.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "base-color"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2684` — Related (weak); init differs from shadcn/ui create.
- `https://github.com/huntabyte/shadcn-svelte/issues/1578` — Related (weak); confusing v0 CLI options.
- `shadcn-ui/ui` `packages/shadcn/src/commands/init.ts` — has no `--base-color`; presets replaced it.

Contribution fit: New issue — port-local dead option; maintainers choose between honoring and removing it.

## Proposed-Change

Either apply `options.baseColor` over the preset's base color, or remove the option as shadcn/ui did.

## Scope-and-Constraints

- Preserve: preset-only `init` behavior.
- Exclude: other preset fields.
- Cost: one line or one option removal.

## Verification

- `init --preset b0 --base-color zinc` → `"baseColor": "zinc"`, or the CLI rejects the unknown option.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `init --base-color` is ignored

Body:

````markdown
### Describe the bug

`init --base-color zinc` is accepted, but `components.json` gets the base color of the preset (`neutral` for `b0`). The option is declared and validated in `commands/init/index.ts`, but `baseColor` is always taken from `decidedPresets.baseColor`.

shadcn/ui no longer has this option, so removing it would also be fine. Right now it's silently ignored.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/init-base-color-ignored.sh

`init --preset b0 --base-color zinc ...` succeeds, and `components.json` has `"baseColor": "neutral"`.

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
