# ISSUE-026 — cli: type stripping replaces the first `.ts` anywhere in the absolute path

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `transformStripTypes` and `update` use `filePath.replace(".ts", ".js")` on absolute paths instead of replacing only the extension.

## Reach-and-Impact

Reach [S]: JavaScript projects whose absolute path contains `.ts` before the file name, e.g. `~/learn.ts-notes/app`.
Impact [S]: Files are written to a different directory outside the project, with the `.ts` name kept.

## Evidence

- [S] `packages/cli/src/utils/transformers/transform-strip-types.ts:17-19` — `filePath.replace(".ts", ".js")`.
- [S] `packages/cli/src/utils/add-registry-items.ts:196-201` — `mkdir` and `writeFile` use the returned path.
- [S] `packages/cli/src/commands/update/index.ts:239-241` — same replace when computing stale files.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "strip types .js path"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — rare trigger; one-line fix.

## Proposed-Change

Use `filePath.replace(/\.ts$/, ".js")` in both places.

## Scope-and-Constraints

- Preserve: `.svelte.ts` → `.svelte.js`.
- Exclude: sucrase handling of non-code files.
- Cost: two lines.

## Verification

- JS project under `/tmp/a.ts-dir/app` → `add utils` → `src/lib/utils.js` inside the project.

## Publication-Blockers

- [O] Reproduction under a path containing `.ts`.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Run `add utils` in a JS project under a `.ts`-containing path and record the written path, steps, and envinfo in the draft.
Done-When: The draft contains reproduction steps, observed path, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: JS projects: `.ts` → `.js` rename replaces the first `.ts` in the absolute path

Body:

````markdown
### Describe the bug

For `"typescript": false`, `transformStripTypes` renames files with `filePath.replace(".ts", ".js")`. `filePath` is absolute, so this replaces the first `.ts` anywhere in the path. In a project under e.g. `~/code/learn.ts-notes/app`, `src/lib/utils.ts` is written to `~/code/learn.js-notes/app/src/lib/utils.ts`, outside the project and still named `.ts`. `update` has the same `replace` when it computes file names.

**Possible fix:** `filePath.replace(/\.ts$/, ".js")` in both places.

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
