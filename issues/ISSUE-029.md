# ISSUE-029 — cli/init+apply: `components.json` is written before the registry work succeeds

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `init` (`runInit`) and `apply` persist the new design-system config before fetching the registry and writing files, so a failed run leaves `components.json` describing a state the project never reached.

## Reach-and-Impact

Reach [S]: `init` and `apply` runs whose registry fetch or file write fails, e.g. network, proxy, or invalid preset errors.
Impact [O]: `components.json` keeps the new `style` and `baseColor` while CSS and components keep the old ones.
Impact [O]: For `init`, the rerun compares against the already-written config, so `styleChanged` is false and the existing components are no longer offered for reinstall.

## Evidence

- [S] `packages/cli/src/commands/init/index.ts:281` — `cliConfig.writeConfig(cwd, config)` runs in the first task of `runInit`.
- [S] `packages/cli/src/commands/init/index.ts:243-246,321` — the reinstall path depends on `existingConfig.style !== decidedPresets.style`.
- [S] `packages/cli/src/commands/init/index.ts:346` — `addRegistryItems` runs afterwards.
- [S] `packages/cli/src/commands/apply/index.ts:122` — `cliConfig.writeConfig(cwd, config)`.
- [S] `packages/cli/src/commands/apply/index.ts:134` — `addRegistryItems` afterwards.
- [O] `shadcn-svelte@1.7.0`, SvelteKit 3.1.0, Node 26.12.0: after `init --preset b0` and `add button`, `init --preset bJKzdQW --proxy http://127.0.0.1:9` printed `Config file components.json created`, then `CLI Error: Failed to fetch registry.`, exit 1; `components.json` changed `style` `nova` → `vega` and `tailwind.baseColor` `neutral` → `zinc`.
- [O] Rerunning the same `init --preset bJKzdQW` without the proxy succeeded with no style-change reinstall prompt; `button` was not offered, and only `utils` appeared in the overwrite prompt.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/init-config-written-before-fetch.sh
- [S] `apply` was not reproduced separately; it has the same write-then-fetch order.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "apply components.json", "proxy init", "components.json reinstall style changed", and "init command fails"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2818` — Related; closed 2026-07-29 as a regional network problem; its log shows `Config file components.json created` before `Failed to fetch registry`, but nobody discussed the persisted config.
- `https://github.com/huntabyte/shadcn-svelte/issues/2932` — Related; the user's own Tailwind v3 report where `add` rewrites `components.json` before a 404; different trigger in `preconditions.ts`.
- `https://github.com/huntabyte/shadcn-svelte/pull/2751` — Related; introduced `apply` and the style-change reinstall path.
- `shadcn-ui/ui` `packages/shadcn/src/commands/init.ts` — backs up an existing `components.json` (`createFileBackup`) and restores it on failure (`restoreBackupOnExit`), so the upstream port has a precedent.

Contribution fit: New issue — one ordering decision shared by `init` and `apply`; the shadcn/ui backup approach shows the intended contract.

## Proposed-Change

Write `components.json` only after `addRegistryItems` succeeds, or back it up and restore it on failure as shadcn/ui does.

## Scope-and-Constraints

- Preserve: `addRegistryItems` reads the in-memory config, so delaying the write does not change its inputs.
- Exclude: rollback of partially written component files.
- Cost: move one task in each command, or reuse a backup helper.

## Verification

- Run the reproduction script → failed `init` leaves `components.json` unchanged → the rerun offers to reinstall `button`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `init` and `apply` update `components.json` even when fetching the preset fails

Body:

````markdown
### Describe the bug

`init` and `apply` write the new `style`, `baseColor`, and design-system fields to `components.json` before fetching the registry. If the fetch fails, `components.json` already describes the new preset while CSS and components are unchanged.

For `init` this also breaks the retry: the rerun compares against the already-written config, so it doesn't detect the style change and doesn't offer to reinstall existing components.

shadcn/ui backs up `components.json` in `init` and restores it on failure. Writing the config only after `addRegistryItems` succeeds would also work.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/init-config-written-before-fetch.sh

1. `init --preset b0`, then `add button`.
2. `init --preset bJKzdQW --proxy http://127.0.0.1:9` fails with `Failed to fetch registry.`
3. `components.json` now has `"style": "vega"` and `"baseColor": "zinc"`.
4. Run `init --preset bJKzdQW` again without the proxy: it succeeds, but `button` is not offered for reinstall.

### Logs

```text
◇  Config file components.json created
└  CLI Error: Failed to fetch registry.
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
