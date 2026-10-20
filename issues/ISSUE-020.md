# ISSUE-020 — registry build: style class injection trims every double-quoted string in shipped files

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: The final cleanup in `injectStyleClasses` trims and collapses whitespace inside every `"..."` match, including non-class string literals and text between two literals.

## Reach-and-Impact

Reach [S]: Every `.svelte` and `.ts` file of every item in every style built by `docs/scripts/build-registry.ts`.
Impact [O]: Shipped code differs from source, e.g. `chart-area-gradient` loses the spaces around its `color-mix(...)` concatenation.
Impact [A]: No current visible breakage is proven; the gradient still receives `var(...)` colors, which tokenize without the spaces.

## Evidence

- [S] `packages/parity/src/inject-style-classes.ts:203-207` — `/(")([^"\\]*)(")/g` replacement with `.trim()`.
- [S] `docs/scripts/build-registry.ts:212-257` — applied to every text file per style.
- [O] `docs/src/lib/registry/blocks/chart-area-gradient.svelte:69` `"color-mix(in lch, " + s.color + " 10%, transparent)"` → `docs/static/registry/styles/nova/chart-area-gradient.json` `"color-mix(in lch," + s.color + "10%, transparent)"`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "color-mix chart gradient"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — latent build-pipeline defect; maintainers may prefer a PR or no action.

## Proposed-Change

Restrict whitespace normalization to `class` attribute values and `cn(...)`/`tv(...)` string arguments.

## Scope-and-Constraints

- Preserve: class normalization after token removal.
- Exclude: style CSS changes.
- Cost: regex or AST change in the parity package plus registry regeneration.

## Verification

- Rebuild registry → non-class string literals in shipped JSON equal their source.

## Publication-Blockers

- Decision whether a latent defect without visible breakage is worth an issue.
- User approval of the exact draft and target.

## Next-Action

Summary: Decide publication value
Action: Search shipped registry output for a non-class literal whose trimming causes visible breakage, or decide to publish as latent.
Done-When: The record names a visible breakage or the user decides to publish or archive.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: Registry build trims spaces inside all string literals, not just class strings

Body:

````markdown
### Describe the bug

The last cleanup step in `injectStyleClasses` (`packages/parity/src/inject-style-classes.ts`) runs `/(")([^"\\]*)(")/g` over the whole file and trims and collapses whitespace in every match. That includes non-class strings and even the code between two string literals. For example, `chart-area-gradient.svelte` has:

`"color-mix(in lch, " + s.color + " 10%, transparent)"`

but the published `styles/*/chart-area-gradient.json` contains:

`"color-mix(in lch," + s.color + "10%, transparent)"`

It still works today because `s.color` is a `var(...)`, but with a hex color it would produce invalid CSS (`#2563eb10%`).

**Possible fix:** limit the normalization to class attribute values and `cn(...)`/`tv(...)` string arguments.

### Reproduction

Compare `docs/src/lib/registry/blocks/chart-area-gradient.svelte` line 69 with the `content` of `docs/static/registry/styles/nova/chart-area-gradient.json`.

### System Info

Not applicable (build output in the repository at `160547e7`).

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
