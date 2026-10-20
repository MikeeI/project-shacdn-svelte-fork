# ISSUE-056 — cli/css: nested `&` selectors only apply to the last selector of a list

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
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `processRule` builds nested `&` selectors with a regex on the whole selector string, so for `h1, h2` the suffix lands only after the last selector.

## Reach-and-Impact

Reach [S]: Item `css` with a selector list and a nested `&` rule.
Impact [O]: The nested styles apply to the first selectors without the pseudo-class, e.g. every `h1` turns blue instead of only `h1:hover`.

## Evidence

- [S] `packages/cli/src/utils/updaters/update-css.ts:521-523` — `selector.replace(/^([^:]+)/, "$1" + prop.substring(1))`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: `"h1, h2": { "color": "red", "&:hover": { "color": "blue" } }` → `h1, h2:hover { color: blue; }`.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "nested selector css" and "&:hover registry"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `update-css` owns selector expansion.

## Proposed-Change

Split the selector list and apply the `&` suffix to each selector, or emit native CSS nesting.

## Scope-and-Constraints

- Preserve: single-selector nesting.
- Exclude: complex selectors with existing pseudo-classes beyond current behavior.
- Cost: small.

## Verification

- Reproduction → `h1:hover, h2:hover { color: blue; }`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Item `css`: `&:hover` under `"h1, h2"` becomes `h1, h2:hover`

Body:

````markdown
### Describe the bug

`processRule` in `update-css.ts` builds nested `&` selectors with `selector.replace(/^([^:]+)/, ...)` on the whole selector list. For

```json
"h1, h2": { "color": "red", "&:hover": { "color": "blue" } }
```

the output is `h1, h2:hover { color: blue; }`, so every `h1` is blue, not only on hover. Expected `h1:hover, h2:hover`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-registry (section "Nested `&` in a selector list only applies to the last selector")

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
