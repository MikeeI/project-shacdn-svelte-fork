# ISSUE-027 — cli/registry: circular `registryDependencies` recurse without bound

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `resolveRegistryItems` recurses into `registryDependencies` without tracking visited items and deduplicates only after recursion.

## Reach-and-Impact

Reach [S]: Custom or remote registries with mutually dependent items.
Impact [S]: `add` overflows the stack or refetches remote URLs indefinitely instead of reporting a cycle.

## Evidence

- [S] `packages/cli/src/utils/registry/index.ts:139-147` — recursive call per dependency.
- [S] `packages/cli/src/utils/registry/index.ts:151-154` — deduplication after recursion.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "circular registryDependencies"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — custom-registry robustness.

## Proposed-Change

Track visited names and URLs and throw a `CLIError` naming the cycle on re-entry.

## Scope-and-Constraints

- Preserve: diamond dependencies resolve once.
- Exclude: registry schema changes.
- Cost: a visited set parameter.

## Verification

- Two items `a → b → a` → `add a` → clear cycle error.

## Publication-Blockers

- [O] Reproduction with two mutually dependent remote items.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Publish two mutually dependent item JSONs, run `add`, and record the failure, URLs, and envinfo in the draft.
Done-When: The draft contains reproduction URLs, observed failure, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `add` recurses forever on circular `registryDependencies`

Body:

````markdown
### Describe the bug

`resolveRegistryItems` (`packages/cli/src/utils/registry/index.ts`) recurses into each item's `registryDependencies` without remembering which items it has already visited, and only deduplicates at the end. If two items depend on each other (`a → b → a`), e.g. two remote items referencing each other with `./a.json`, the CLI recurses until the stack overflows, fetching the same URLs again and again, instead of reporting the cycle.

**Possible fix:** keep a visited set of names/URLs and throw a `CLIError` that names the cycle.

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
