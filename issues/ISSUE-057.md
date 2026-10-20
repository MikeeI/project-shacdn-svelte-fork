# ISSUE-057 — cli/registry build: `overrideDependencies` is not applied to detected peer dependencies

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `resolveProjectDeps` resolves peer lists to versioned strings before `registry build` applies `overrideDependencies`, which only rewrites the overridden package's own entry.

## Reach-and-Impact

Reach [S]: Registries that override the version of a package that another dependency declares as a peer.
Impact [O]: Generated items still list the pre-override peer version.

## Evidence

- [S] `packages/cli/src/commands/registry/deps-resolver.ts:32,65-78` — `resolvePeerVersions` stores peers as `name@version`.
- [S] `packages/cli/src/commands/registry/build.ts:97-117` — overrides run afterwards and only update `deps.versions[name]` and the package's own key.
- [O] `shadcn-svelte@1.7.0` and `97fdb93`, Node 26.12.0: `overrideDependencies: ["registry-peer@9.9.9"]`, item imports `registry-consumer` whose peer is `registry-peer` → `"dependencies": ["registry-consumer@1.0.0", "registry-peer@1.2.3"]`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-override-skips-peers.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "overrideDependencies"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `registry build` owns override application.

## Proposed-Change

Apply overrides before `resolvePeerVersions`, or rewrite matching peer entries when applying an override.

## Scope-and-Constraints

- Preserve: overrides of direct dependencies.
- Exclude: dev dependency handling beyond the same rule.
- Cost: reorder or one extra loop.

## Verification

- Reproduction script → `registry-peer@9.9.9`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `registry build`: `overrideDependencies` doesn't apply to peer dependencies

Body:

````markdown
### Describe the bug

`resolveProjectDeps` turns peer lists into `name@version` strings before `registry build` applies `overrideDependencies`. The override only rewrites the overridden package's own entry, so peers added through another dependency keep the old version.

With `"overrideDependencies": ["registry-peer@9.9.9"]` and an item that imports `registry-consumer` (peer: `registry-peer`):

```json
"dependencies": ["registry-consumer@1.0.0", "registry-peer@1.2.3"]
```

Expected `registry-peer@9.9.9`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-override-skips-peers.sh

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
