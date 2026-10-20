# ISSUE-033 — cli/preset: v1 preset codes lose their colored chart palette

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: Medium
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `V1_CHART_COLOR_MAP` is defined to restore v1 chart colors but no decoder or consumer uses it, so decoded v1 presets get the default `neutral` chart color.

## Reach-and-Impact

Reach [S]: `init` and `apply` with preset codes created before preset v2.
Impact [A]: Projects initialized from old preset links get gray charts instead of the colored palette the preset originally produced.

## Evidence

- [S] `packages/cli/src/preset/preset.ts:71-82` — comment "Used by consumers to restore the original chart colors when decoding v1 presets" and the map.
- [S] `grep V1_CHART_COLOR_MAP` over `packages` and `docs/src` → definition only.
- [S] `packages/cli/src/preset/preset.ts:220-248` — v1 decode sets no `chartColor`.
- [S] `docs/src/lib/registry/config.ts:267` — `{ chartColor: "neutral", ...config }` default.

## Prior-Art

Coverage: not searched separately; covered by the "update cssVars" and preset searches without matches; checked=2026-10-20.
Gaps: dedicated preset search, discussions, releases, and Discord.

- None found.

Contribution fit: New issue — relies on the comment's stated intent; maintainers may have dropped v1 restoration deliberately.

## Proposed-Change

In v1 decode, set `chartColor = V1_CHART_COLOR_MAP[theme] ?? theme`.

## Scope-and-Constraints

- Preserve: v2 codes.
- Exclude: preset bit layout.
- Cost: one assignment.

## Verification

- Decode a v1 code with theme `neutral` → `chartColor: "blue"`.

## Publication-Blockers

- Dedicated prior-art search for preset chart colors.
- [O] A real v1 preset code reproduced through `init --preset`.
- User approval of the exact draft and target.

## Next-Action

Summary: Verify with v1 preset
Action: Find a v1 preset code, run `init --preset <code>` in the repro template, and record the chart variables and envinfo in the draft.
Done-When: The draft contains the observed chart variables and envinfo, or the record is archived as intended behavior.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: v1 preset codes lose their chart colors (`V1_CHART_COLOR_MAP` is never used)

Body:

````markdown
### Describe the bug

`packages/cli/src/preset/preset.ts` defines `V1_CHART_COLOR_MAP` with the comment "Used by consumers to restore the original chart colors when decoding v1 presets", but nothing uses it. The v1 branch of `decodePreset` returns no `chartColor`, and `encodePreset`/the `/init` endpoint fill in the default `neutral`. So a v1 preset that used to produce blue charts (base color `neutral`) now produces gray charts.

**Possible fix:** set `chartColor = V1_CHART_COLOR_MAP[theme] ?? theme` when decoding v1 codes, if restoring them is still intended.

### Reproduction

Pending: v1 preset code and repository link.

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
