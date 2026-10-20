# ISSUE-029 — cli/apply: `components.json` is written before the preset is fetched

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

Root-Cause [S]: `apply` persists the new design-system config before `addRegistryItems` fetches and writes the preset.

## Reach-and-Impact

Reach [S]: `apply` runs whose registry fetch or file write fails.
Impact [S]: `components.json` describes the new style, icon library, and base color while CSS and components keep the old ones; a rerun recovers.

## Evidence

- [S] `packages/cli/src/commands/apply/index.ts:122` — `cliConfig.writeConfig(cwd, config)`.
- [S] `packages/cli/src/commands/apply/index.ts:134` — `addRegistryItems` afterwards.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "apply components.json"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — low impact; maintainers may consider it intended.

## Proposed-Change

Write `components.json` after `addRegistryItems` succeeds.

## Scope-and-Constraints

- Preserve: `addRegistryItems` reads the in-memory config, so ordering of the write does not change its inputs.
- Exclude: rollback of partially written files.
- Cost: move one block.

## Verification

- Block the registry host → `apply <preset>` fails → `components.json` unchanged.

## Publication-Blockers

- [O] Reproduction with a failing registry fetch.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Run `apply` with an unreachable registry and record the changed `components.json`, steps, and envinfo in the draft.
Done-When: The draft contains reproduction steps, observed diff, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `apply` updates `components.json` even when applying the preset fails

Body:

````markdown
### Describe the bug

`apply` writes the new `style`, `iconLibrary`, `menuColor`, `menuAccent`, and `baseColor` to `components.json` before calling `addRegistryItems`. If fetching the preset or writing files fails (network error, proxy, invalid preset item), `components.json` already describes the new design system while the CSS and components are unchanged. Later `add` calls then fetch components for a style the project doesn't use yet.

**Possible fix:** write `components.json` only after `addRegistryItems` succeeds.

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
