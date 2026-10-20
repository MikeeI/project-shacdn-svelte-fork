# ISSUE-063 — cli/registry build: the `components` alias replaces imports that belong to the nested `ui` alias

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

Root-Cause [S]: `transformAliases` replaces aliases with `replaceAll` in `ALIASES` order, so a shorter alias that is a prefix of a longer one (`$lib/components` before `$lib/components/ui`) consumes the longer path first.

## Reach-and-Impact

Reach [S]: Registries built with `components` and `ui` aliases where `ui` is nested inside `components`, which matches the default layout.
Impact [O]: Output uses `$COMPONENTS$/ui/...` instead of `$UI$/...`, so consumers with a non-nested `ui` alias get unresolved imports.
Impact [A]: Consumers with the default nested layout are unaffected because both placeholders resolve to the same path.

## Evidence

- [S] `packages/cli/src/commands/registry/build.ts:228-238` — loop over `ALIASES` with `content.replaceAll(path, placeholder)`.
- [O] `shadcn-svelte@1.7.0` and `97fdb93`, Node 26.12.0: aliases `components: "$lib/components"`, `ui: "$lib/components/ui"`; source `import Button from "$lib/components/ui/button"` → `import Button from "$COMPONENTS$/ui/button"`.
- [O] Script: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-alias-order.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry build alias" and "$UI$"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2935` — Related; the user's report on template imports that don't resolve after install.

Contribution fit: New issue — `transformAliases` owns placeholder mapping.

## Proposed-Change

Replace aliases in descending path length, or match whole import specifiers.

## Scope-and-Constraints

- Preserve: placeholders for non-overlapping aliases.
- Exclude: consumer-side alias resolution.
- Cost: sort before replacing.

## Verification

- Reproduction script → `$UI$/button`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `registry build` uses `$COMPONENTS$/ui/...` instead of `$UI$/...` for nested aliases

Body:

````markdown
### Describe the bug

`transformAliases` in `commands/registry/build.ts` replaces aliases one after another with `replaceAll`. With the usual `components: "$lib/components"` and `ui: "$lib/components/ui"`, the `components` alias runs first and also matches `$lib/components/ui/...`:

```json
"content": "import Button from \"$COMPONENTS$/ui/button\";\nexport { Button };\n"
```

Expected `$UI$/button`. For projects whose `ui` alias isn't inside `components`, the installed import doesn't resolve. Replacing the longest alias first would avoid it.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/blob/main/registry-build/build-alias-order.sh

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
