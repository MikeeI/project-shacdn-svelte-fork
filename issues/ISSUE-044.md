# ISSUE-044 — cli/registry build: pnpm `catalog:` versions are emitted as `pkg@catalog:`

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `toVersionedName` resolves the `workspace:` protocol but returns any other manifest range verbatim, so pnpm `catalog:` ranges reach the generated item's `dependencies`.

## Reach-and-Impact

Reach [S]: Every registry built with `shadcn-svelte registry build` from a pnpm workspace that uses catalogs, including the official docs registry.
Impact [O]: Generated items list `pkg@catalog:`, which consumers outside that workspace cannot install.
Impact [O]: The official `dashboard-01` item shipped `zod@catalog:` twice (#2665, #2858); both times only the docs dependency was pinned.

## Evidence

- [S] `packages/cli/src/commands/registry/deps-resolver.ts:133-150` — only `workspace:` is resolved; line 149 returns `${name}@${version}`.
- [O] `shadcn-svelte@1.7.0` and `97fdb93`, Node 26.12.0, pnpm 10.32.1: package with `"is-number": "catalog:"` and catalog `is-number: 7.0.0` → `"dependencies": ["is-number@catalog:"]`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-emits-catalog-protocol.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "catalog" and "registry build catalog"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2665` — Related (strong); closed; `zod@catalog: failed to resolve` for `dashboard-01`.
- `https://github.com/huntabyte/shadcn-svelte/pull/2666` — Workaround; merged 2026-04-20; pinned `zod` in `docs/package.json`.
- `https://github.com/huntabyte/shadcn-svelte/pull/2858` — Related (strong); merged 2026-09-01; same regression and workaround; its author offered to resolve `catalog:` during registry generation.
- `https://github.com/huntabyte/shadcn-svelte/issues/1939` — Related (weak); consumer-side catalog problem.

Contribution fit: New issue — reports the root cause behind two workaround PRs; reference #2858 so its author can pick it up.

## Proposed-Change

Resolve `catalog:` and `catalog:<name>` from `pnpm-workspace.yaml`, or fall back to the installed package version as `workspace:*` already does.

## Scope-and-Constraints

- Preserve: `workspace:` handling and explicit ranges.
- Exclude: other package managers' catalog formats.
- Cost: small resolver addition.

## Verification

- Reproduction script → `"dependencies": ["is-number@7.0.0"]`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `registry build` writes pnpm `catalog:` versions into item dependencies

Body:

````markdown
### Describe the bug

`registry build` copies pnpm `catalog:` ranges into the generated items, e.g. `"dependencies": ["is-number@catalog:"]`. `toVersionedName` in `deps-resolver.ts` handles `workspace:` but returns every other range as is.

This is what caused #2665 and #2858 (`zod@catalog:` in `dashboard-01`). Both were fixed by pinning `zod` in `docs/package.json`, so the next catalog dependency will hit it again. #2858 already suggested resolving catalogs during generation.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-emits-catalog-protocol.sh

The script creates a pnpm workspace with `"is-number": "catalog:"` and `catalog: { is-number: 7.0.0 }`, runs `registry build`, and prints the item:

```json
"dependencies": ["is-number@catalog:"]
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
  shadcn-svelte: 1.7.0 (npx)
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
