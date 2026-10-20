# ISSUE-040 — cli: `parseStyleCss` copy the parity README says to keep in sync has no caller

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Maintainability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `parseStyleCss`, `subjectCnClass`, and `getRegistryTheme` were added to the CLI in #2471 without a caller, and the parity README later documented the unused `parseStyleCss` copy as one that must stay in sync.

## Reach-and-Impact

Reach [S]: CLI source and `packages/parity/README.md`; `utils/registry` is not in the CLI `exports` map.
Impact [S]: Maintainers are told to mirror parser changes into a copy that nothing runs, and the CLI keeps about 45 unused lines.
Impact [S]: No runtime or user-visible effect.

## Evidence

- [S] `packages/cli/src/utils/registry/index.ts:4,45-86` — `parseCss` import, `getRegistryTheme`, `subjectCnClass`, `parseStyleCss`.
- [S] `packages/cli/src/utils/prompt-helpers.ts:38-41` — `getPadding`, no caller since `aa40d5b8` (#2129); added in `61d98fd5` (#1699).
- [S] `packages/parity/README.md:139` — "The published CLI keeps its own postcss-based copy … Keep the two in sync."
- [S] `packages/cli/package.json:17-61` — `exports` exposes `icons`, `preset`, `schema`, `utils/css`, `transformers/*`, and `tailwind.css` only.
- [O] `git grep` at `97fdb936` in `packages/cli/src` and `sv-addons` for `getRegistryTheme|parseStyleCss|getPadding` → only the three definitions.
- [S] Tests only: `packages/cli/test/commands/init.test.ts:22` spies on `getRegistryTheme`; `test/utils/registry.test.ts:138-148` tests it.
- [O] `git log -S` at `97fdb936`: `parseStyleCss(` and `getRegistryTheme(` occur in CLI source only since `24b3ae4a` (#2471); the README sentence comes from `4c6406f1` (#2876).

## Prior-Art

Coverage: issues and PRs (open and closed) via `gh search` for "parseStyleCss", "getRegistryTheme", "prompt-helpers", "dead code"; checked=2026-10-20.
Gaps: discussions and Discord were not searched.

- None found.

Contribution fit: New issue phrased as a question, because the copy may be reserved for planned CLI work.
Routing: [S] shadcn-svelte CLI and parity package.

## Proposed-Change

If no CLI use is planned, delete the three functions, the `parseCss` import, `getPadding`, the related test cases and spy, and the README sync sentence.
Otherwise, keep the copy and document its intended caller.

## Scope-and-Constraints

- Preserve: `postcss` dependency (used by `utils/updaters/*`) and every exported CLI entry.
- Exclude: the parity package implementation.

## Verification

- `pnpm -F shadcn-svelte check` → passes.
- `pnpm -F shadcn-svelte exec vitest run test/commands/init.test.ts test/utils/registry.test.ts` → passes.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves and the issue URL is recorded, or the user declines and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: cli: `parseStyleCss` copy that `packages/parity/README.md` says to keep in sync is never called

Body:

````markdown
### Describe the bug

`packages/parity/README.md` says the CLI keeps its own postcss-based `parseStyleCss` in `packages/cli/src/utils/registry/index.ts` and asks to keep the two in sync.
The copy was added in #2471, and at 97fdb93 nothing in the CLI calls it.
The same is true for `getRegistryTheme` next to it (only referenced by tests), which also came in with #2471, and for `getPadding` in `utils/prompt-helpers.ts`, whose last caller went away in #2129.
`utils/registry` isn't part of the package `exports`, so there are no external callers either.

Is the CLI copy meant for planned work?
If not, deleting `parseStyleCss` (with its `subjectCnClass` helper and the `parseCss` import), `getRegistryTheme` with its tests and spy, `getPadding`, and the README sentence would remove the sync burden.
If it is, a note on where it will be used would help.

### Reproduction

No runtime reproduction is possible because the functions are never called.
On commit 97fdb9364926716d33b3c5570ae3a84dd6493428:

```bash
git grep -nE 'getRegistryTheme|parseStyleCss|getPadding' -- packages/cli/src sv-addons
```

The only hits are the three definitions.

### System Info

Not applicable (repository source at 97fdb93).

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I thoroughly reviewed this contribution with Claude Opus 5.5 (medium reasoning effort).

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
