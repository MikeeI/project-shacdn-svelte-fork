# ISSUE-001 — docs/create: `inherit` heading font renders in Geist

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: The design system provider resolves `--font-heading` by looking up a `font-heading-*` registry item and falls back to `fonts[0]` (Geist) when none matches; `inherit` never matches an item.

## Reach-and-Impact

Reach [S]: Every /create and /preview preset with `fontHeading: "inherit"`, which is the default and the 70% branch of `randomize()`.
Impact [O]: Headings render in Geist instead of the body font while the UI labels the heading font as inherited; generated CLI output is not affected.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider.svelte:87-90` — `?.font.family ?? fonts[0].font.family`.
- [S] `docs/src/lib/registry/fonts.ts:29` — `fonts = [...bodyFonts, ...headingFonts]`, so `fonts[0]` is `font-geist`.
- [O] `/preview/preview?preset=b3CC` (font `lora`, heading `inherit`) → specimen label "Inherit - Lora", `.cn-font-heading` computed `"Geist Variable", sans-serif`; environment=`vite dev`, headless Chromium, Linux x64.
- [O] Default `/create` → root style `--font-heading: 'Geist Variable'` while the body uses Inter.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2617` — Distinct; CLI error for `font-heading` inherit, not the docs provider fallback.

Contribution fit: New contribution — the provider fallback owns the wrong `--font-heading` value.
Routing: [S] Still present at `upstream/main@ffcd275b`; `shadcn-ui/ui@ba1503c` `apps/v4/app/(app)/(create)/components/design-system-provider.tsx:90-100` resolves `inherit` to the body font, so shadcn/ui does not share the defect.

## Proposed-Change

Fall back to `var(--font-sans)` instead of `fonts[0].font.family` when no heading font item matches.

## Scope-and-Constraints

- Preserve: explicit heading fonts keep their own family.
- Exclude: font registry restructuring and CLI preset handling.
- Cost: one-line change in one component.

## Verification

- `/preview/preview` with `lora`/`inherit` → heading `"Lora Variable", serif`, equal to body.
- `/preview/preview` with `inter`/`playfair-display` → heading `"Playfair Display Variable", serif`, body Inter.

## Publication-Blockers

- User approval of the exact draft and target.
- Reasoning effort of the investigating sessions is unverified, so the draft omits the fixed `(extra high reasoning effort)` clause.

## Next-Action

Summary: Await draft approval
Action: Present the exact PR draft and target to the user for approval.
Done-When: The user approves, edits, or rejects the draft.

## Pull-Request-Implementation

Branch: `fix/docs-heading-font-inherit`
Base: `upstream/main@7e463da6`
Scope: `docs/src/lib/features/design-system/components/design-system-provider.svelte` heading font fallback.
Commit: `4c63b1e9`
Push: `origin/fix/docs-heading-font-inherit`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenarios in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-heading-font-inherit`
Title: fix: use the body font for inherited headings on /create

Body:

```markdown
When a preset uses `fontHeading: "inherit"` (the default), the design system provider can't find a heading font item and falls back to `fonts[0]`, which is Geist. Headings on /create and in the previews then render in Geist instead of the body font, while the picker says "Inherit".

This falls back to `var(--font-sans)` instead.

Repro: open `/preview/preview?preset=b3CC` (Lora, heading inherit) and inspect a heading: before it's Geist, after it's Lora.

### Disclosure

Investigated thoroughly with Claude Opus 5.5, using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
```
