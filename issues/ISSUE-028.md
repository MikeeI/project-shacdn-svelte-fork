# ISSUE-028 — cli/registry: schema-valid `registry:item` fails with a raw `TODO` error

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: API
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: The registry schema accepts `registry:item`, but `getItemAliasDir` has no mapping for it and throws `TODO: unhandled item type`.

## Reach-and-Impact

Reach [S]: `add` and `update` of any item with type `registry:item`.
Impact [S]: The command aborts with a non-`CLIError` message and nothing is written.

## Evidence

- [S] `packages/cli/src/utils/registry/schema.ts:6-19` — `"registry:item"` in the allowed types.
- [S] `packages/cli/src/utils/registry/index.ts:226` — `throw new Error("TODO: unhandled item type ...")`.
- [S] `packages/cli/src/utils/add-registry-items.ts:127` and `packages/cli/src/commands/update/index.ts:176` — called for every non-style item.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: `add http://localhost:5555/r/e22item.json --yes --no-deps` for an item with `"type": "registry:item"` and one `registry:file` printed `Error: TODO: unhandled item type registry:item` and exited 1.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry:item"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — maintainers decide whether `registry:item` maps to `cwd` or is rejected.

## Proposed-Change

Map `registry:item` to `cwd` like `registry:file`, or reject it during validation with a `CLIError`.

## Scope-and-Constraints

- Preserve: existing type mappings.
- Exclude: schema redesign.
- Cost: one branch.

## Verification

- `add <url-of-registry:item>` → files written, or a clear validation error.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Adding a `registry:item` fails with `TODO: unhandled item type`

Body:

````markdown
### Describe the bug

`registry:item` is an allowed type in the registry schema (`utils/registry/schema.ts`), but `getItemAliasDir` has no case for it and ends with `throw new Error("TODO: unhandled item type ...")`. `addRegistryItems` and `update` call it for every non-style item, so adding a valid `registry:item` from a URL fails with that internal message and nothing is written.

**Possible fix:** map `registry:item` to the project root like `registry:file`, or reject it early with a `CLIError` if it isn't supported.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "`registry:item` is accepted by the schema but rejected on install")

`pnpm dlx shadcn-svelte@latest add http://localhost:5555/r/e22item.json --yes --no-deps`

### Logs

```text
└  Error: TODO: unhandled item type registry:item
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
