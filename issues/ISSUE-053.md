# ISSUE-053 — cli/transformers: JS projects run the TypeScript stripper on non-code files

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

Root-Cause [S]: `transformStripTypes` sends every non-`.svelte` file through `sucrase`, including JSON, CSS, Markdown, and other `registry:file` content.

## Reach-and-Impact

Reach [S]: `"typescript": false` projects that install items with non-code files, mainly from custom registries.
Impact [O]: The install aborts after earlier files were already written, leaving a partial install.

## Evidence

- [S] `packages/cli/src/utils/transformers/transform-strip-types.ts:8-15` — only `.svelte` is special-cased; everything else goes to `sucraseTransform`.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0, JSDoc project: `add` of an item with `registry:lib` `e18/helper.ts` and `registry:file` `~/e18-data.json` printed `SyntaxError: Unexpected token, expected ";" (2:5)`; `src/lib/e18/helper.js` was written, `e18-data.json` was not.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-js-strip-types

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "typescript false" and "strip types"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2857` — Related (weak); JS-project strip-types failure with a different error (`Cannot split a chunk`).

Contribution fit: New issue — the transformer owns which files it touches.

## Proposed-Change

Only strip types for `.ts`, `.tsx`, `.mts`, `.cts`, and `.svelte` files; pass other files through unchanged.

## Scope-and-Constraints

- Preserve: `.ts` → `.js` handling.
- Exclude: rollback of partial installs.
- Cost: extension check.

## Verification

- Reproduction → both files written, `e18-data.json` unchanged.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: JS projects: `add` fails on items that include a JSON (or other non-code) file

Body:

````markdown
### Describe the bug

With `"typescript": false`, `transformStripTypes` runs every file that isn't `.svelte` through sucrase. A JSON file in a registry item fails to parse, and the install stops after the earlier files were already written.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-js-strip-types

The item has `e18/helper.ts` (`registry:lib`) and `~/e18-data.json` (`registry:file`). After `add`, `src/lib/e18/helper.js` exists and `e18-data.json` doesn't.

### Logs

```text
└  SyntaxError: Unexpected token, expected ";" (2:5)
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
