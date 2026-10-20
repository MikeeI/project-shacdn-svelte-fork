# ISSUE-035 — [shadcn-ui/ui] CLI: dark `@custom-variant` is skipped when any other `@custom-variant` exists

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: shadcn-ui/ui
Contribution-Priority: Low
Root-Cause-Confidence: Medium
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `shadcn-ui/ui@main`

## Root-Cause

Root-Cause [S]: shadcn/ui's `addCustomVariant` plugin finds any top-level `custom-variant` at-rule by name and skips adding the dark variant.

## Reach-and-Impact

Reach [A]: shadcn/ui CLI runs on stylesheets that already contain an unrelated `@custom-variant`.
Impact [A]: Same as ISSUE-017: `dark:` utilities follow the OS preference while `.dark` variables follow the class.

## Evidence

- [S] `shadcn-ui/ui` `packages/registry/src/updaters/update-css-vars.ts:513-520` — `node.type === "atrule" && node.name === "custom-variant"`.
- [S] ISSUE-017 — same defect in shadcn-svelte.

## Prior-Art

Coverage: none yet for `shadcn-ui/ui`.
Gaps: issues, PRs, discussions, and releases of `shadcn-ui/ui`; the pinned commit was not recorded.

- None checked.

Contribution fit: Undetermined until shadcn/ui prior art and runtime behavior are checked.

## Proposed-Change

Match only `custom-variant` rules whose params start with `dark`.

## Scope-and-Constraints

- Preserve: user-defined dark variants.
- Exclude: shadcn-svelte, which ISSUE-017 owns.
- Cost: one predicate.

## Verification

- `shadcn init` on a Tailwind v4 project whose CSS has `@custom-variant hocus` → dark variant present.

## Publication-Blockers

- Pinned `shadcn-ui/ui` commit and current call path of `addCustomVariant`.
- Prior-art search in `shadcn-ui/ui`.
- [O] Reproduction with the shadcn CLI.
- `shadcn-ui/ui` issue template mapping.
- User approval of the exact draft and target.

## Next-Action

Summary: Verify shadcn/ui behavior
Action: Pin the shadcn/ui commit, search its issues, and reproduce with `npx shadcn@latest init` on a stylesheet containing `@custom-variant hocus`.
Done-When: The record holds a pinned source, prior-art result, and observed output.
