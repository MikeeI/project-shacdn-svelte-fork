# ISSUE-028 — cli/registry: schema-valid `registry:item` fails with a raw `TODO` error

State: Investigating
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

- [O] Reproduction with a hosted `registry:item`.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Host a minimal `registry:item`, run `add` on it, and record the error, URL, and envinfo in the draft.
Done-When: The draft contains a reproduction URL, observed error, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Adding a `registry:item` fails with `TODO: unhandled item type`

Body:

````markdown
### Describe the bug

`registry:item` is an allowed type in the registry schema (`utils/registry/schema.ts`), but `getItemAliasDir` has no case for it and ends with `throw new Error("TODO: unhandled item type ...")`. `addRegistryItems` and `update` call it for every non-style item, so adding a valid `registry:item` from a URL fails with that internal message and nothing is written.

**Possible fix:** map `registry:item` to the project root like `registry:file`, or reject it early with a `CLIError` if it isn't supported.

### Reproduction

Pending: repository link.

### System Info

Pending: envinfo output.

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
