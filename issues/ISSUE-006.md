# ISSUE-006 — docs: malformed foreign cookie breaks every page with a 500

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: `parseCookie` runs `decodeURIComponent` on every `document.cookie` entry, so any cookie with an invalid percent-escape throws a `URIError` during the client layout load.

## Reach-and-Impact

Reach [A]: Only browsers holding such a cookie for the docs origin, for example from a third-party script or extension; frequency is unmeasured.
Impact [O]: Every hydrated page renders the SvelteKit 500 error page until the cookie is removed.

## Evidence

- [S] `docs/src/lib/user-config.svelte.ts:54-68` — `parseCookie` decodes all cookies and splits on every `=`.
- [O] `document.cookie = "repro_bad=%E0; path=/"` → reload `/docs/components/button` → page shows `500 Internal Error`; environment=`vite dev`, headless Chromium, Linux x64.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- None found for cookie parsing or URIError in the docs.

Contribution fit: New contribution — `parseUserConfig` owns the client cookie read.
Routing: [S] Still present at `upstream/main@ffcd275b`; SvelteKit 2.70.1 `cookies.get` delegates to `cookie@0.6.0`, which documents keeping undecodable values, so `sveltejs/kit` is not implicated. `shadcn-ui/ui@ba1503c` stores preferences in localStorage (`apps/v4/hooks/use-config.ts:1-18`), so shadcn/ui does not share the defect.

## Proposed-Change

Read only `scn_user_config`, split on the first `=`, and fall back to the default config when its value cannot be decoded.

## Scope-and-Constraints

- Preserve: a valid `scn_user_config` cookie still applies on the client.
- Exclude: server-side cookie handling, which uses SvelteKit's parser.
- Cost: low; reach is narrow, so maintainers may rate it as hardening.

## Verification

- Fix branch: bad foreign cookie plus `scn_user_config` (`layout: fixed`, `packageManager: bun`) → page renders, `layout-fixed` applied, bun tab selected.

## Publication-Blockers

- User approval of the exact draft and target.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Await draft approval
Action: Present the exact PR draft and target to the user for approval.
Done-When: The user approves, edits, or rejects the draft.

## Pull-Request-Implementation

Branch: `fix/docs-user-config-cookie-parse`
Base: `upstream/main@7e463da6`
Scope: `docs/src/lib/user-config.svelte.ts` client cookie lookup.
Commit: `1a3e63de`
Push: `origin/fix/docs-user-config-cookie-parse`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenario in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-user-config-cookie-parse`
Title: fix: don't crash the docs on unrelated malformed cookies

Body:

```markdown
The client layout load reads the user config by running `decodeURIComponent` on every cookie in `document.cookie`. If any other cookie on the domain has an invalid escape (e.g. `x=%E0`), it throws a URIError and every page shows the 500 error page.

This only looks up `scn_user_config`, splits on the first `=`, and falls back to the default config if that value can't be decoded.

Repro: run `document.cookie = "x=%E0; path=/"` on the docs and reload.
```
