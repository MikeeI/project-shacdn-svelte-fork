# ISSUE-003 — docs/create: leaving /create restores `style-vega` instead of the site style

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: UI
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: The provider's `onDestroy` adds `style-${DEFAULT_CONFIG.style}` (`vega`), but the site renders with `style-nova` from `app.html` since the default moved to nova.

## Reach-and-Impact

Reach [S]: Every client-side navigation from /create to any other docs page.
Impact [O]: The rest of the docs keep Vega styling until a full reload.

## Evidence

- [S] `docs/src/lib/features/design-system/components/design-system-provider.svelte:140-149` — `onDestroy` restores `style-${DEFAULT_CONFIG.style}`.
- [S] `docs/src/lib/registry/config.ts:89` — `DEFAULT_CONFIG.style = "vega"`; `docs/src/app.html:39` — body class `style-nova`.
- [O] `/create/preview-02` (body `style-lyra base-color-neutral`) → client-side link to `/docs/components/button` → body `style-vega`; after reload `style-nova`; environment=`vite dev`, headless Chromium, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2911` — Related; set the docs default style to nova but left the provider restore on `DEFAULT_CONFIG.style`.
- `https://github.com/huntabyte/shadcn-svelte/issues/2772` — Related; earlier default-style change to vega.

Contribution fit: New contribution — the provider unmount owns the restore.

## Proposed-Change

Capture the site's own `style-*`/`base-color-*` body classes when the provider first replaces them, and restore exactly those on unmount.

## Scope-and-Constraints

- Preserve: preset classes still apply while /create is mounted.
- Exclude: changing `DEFAULT_CONFIG` or the site default style.
- Cost: small state in one component; restore follows future `app.html` changes automatically.

## Verification

- Fix branch: /create (body `style-vega base-color-neutral`) → client-side navigation → body `style-nova`, no hard navigation.

## Publication-Blockers

- User approval of the exact draft and target.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Await draft approval
Action: Present the exact PR draft and target to the user for approval.
Done-When: The user approves, edits, or rejects the draft.

## Pull-Request-Implementation

Branch: `fix/docs-restore-body-style-on-unmount`
Base: `upstream/main@7e463da6`
Scope: `design-system-provider.svelte` body class capture and restore.
Commit: `29bf3223`
Push: `origin/fix/docs-restore-body-style-on-unmount`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenario in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-restore-body-style-on-unmount`
Title: fix: restore the site style class when leaving /create

Body:

```markdown
When the design system provider unmounts it puts `style-${DEFAULT_CONFIG.style}` on the body, which is `style-vega`. Since #2911 the site itself uses `style-nova` (from app.html), so after navigating from /create to any docs page the docs keep Vega styling until a reload.

This remembers the site's own `style-*`/`base-color-*` body classes when the provider first replaces them and restores those on unmount.

Repro: open /create, click a link to any docs page, check the body class.
```
