# ISSUE-007 — docs/registry: Lyra preset description says Tabler but uses Hugeicons

State: Archived
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Other
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: The Lyra entry in `PRESETS` describes its icon library as Tabler while its `iconLibrary` is `hugeicons`.

## Reach-and-Impact

Reach [S]: None; `PRESETS` is only consumed by `preset-picker.svelte`, which no route or component imports.
Impact [S]: No user-visible text or behavior depends on the description.

## Evidence

- [S] `docs/src/lib/registry/config.ts:152` — Lyra description "Lyra / Tabler / JetBrains Mono" with `iconLibrary: "hugeicons"`.
- [S] `PRESETS` consumers in `docs/src` and `docs/scripts` → only `routes/(app)/(layout)/(create)/components/preset-picker.svelte`.
- [S] `PresetPicker|preset-picker` references in `docs/src` → none outside its own file.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found.

Contribution fit: None — the mismatch lives in unmounted code.

## Proposed-Change

None; a fix would only matter if the preset picker is mounted again.

## Scope-and-Constraints

- Preserve: no change.
- Exclude: removing the unused preset picker, which is a separate maintenance decision.
- Cost: not applicable.

## Verification

- Code search above → no rendering path for `PRESETS[].description`.

## Publication-Blockers

None.

## Next-Action

Summary: —
Action: None.
Done-When: None.

## Archive

Archive-Reason: Finding-Invalidated
Detail: None.
Evidence: `preset-picker.svelte` is not imported anywhere in `docs/src` at `upstream/main@7e463da6`, so the description is never rendered.
Checked: 2026-10-20
