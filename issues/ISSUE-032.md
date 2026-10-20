# ISSUE-032 — sv-addons/registry: `registry.json` keeps `src/lib` paths when the lib directory is customized

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: Medium
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: The add-on writes template files under `directory.lib`, but copies `registry.json` verbatim with hard-coded `src/lib/registry/...` paths.

## Reach-and-Impact

Reach [S]: Projects with a custom `kit.files.lib` that run the `@shadcn-svelte/registry` add-on.
Impact [A]: `shadcn-svelte registry build` cannot find the item files.

## Evidence

- [S] `sv-addons/registry/src/utils/templates.ts:54-68` — template paths map to `directory.lib` and `directory.kitRoutes`; `registry.json` is returned unchanged.
- [S] `sv-addons/registry/src/index.ts:44-53` — copies `registry.json` verbatim.
- [S] `sv-addons/registry/template/registry.json` — every `path` starts with `src/lib/registry/`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry template lib directory"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — rare configuration.

## Proposed-Change

Rewrite the `path` entries in `registry.json` with the resolved lib directory when copying the template.

## Scope-and-Constraints

- Preserve: default `src/lib` projects.
- Exclude: other template contents.
- Cost: JSON transform in the add-on.

## Verification

- `kit.files.lib = "src/app-lib"` → add-on → `pnpm build:registry` succeeds.

## Publication-Blockers

- [O] Reproduction with a custom lib directory.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Scaffold with a custom `kit.files.lib`, run `build:registry`, and record the error, repository URL, and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed error, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Registry add-on: `registry.json` paths ignore a custom `kit.files.lib`

Body:

````markdown
### Describe the bug

The `@shadcn-svelte/registry` add-on writes the template files relative to `directory.lib` (`resolveProjectPath` in `src/utils/templates.ts`), so a custom `kit.files.lib` is respected for the files. `registry.json`, however, is copied verbatim, and all of its `path` entries are `src/lib/registry/...`. With a custom lib directory, `shadcn-svelte registry build` points at files that don't exist.

**Possible fix:** rewrite the `path` entries in `registry.json` with the resolved lib directory while copying the template.

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
