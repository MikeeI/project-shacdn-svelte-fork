# ISSUE-009 — docs: Copy Page copies the error response when the Markdown route fails

State: PR-Ready
Authorized-Work: Pull-Request-Implementation
Publication-Target: New-pull-request
External-Reference: Not published.
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@7e463da6`

## Root-Cause

Root-Cause [S]: `copyPage()` copies `await res.text()` of `${pageUrl}.md` without checking `res.ok`.

## Reach-and-Impact

Reach [O]: Local `vite dev` and any deployment without the generated `.md` files; production returned `200 text/markdown` for five sampled docs pages.
Impact [O]: Under `vite dev` the request returns 404 with an 852 KB HTML error page, and the button attempts to copy it without any feedback.

## Evidence

- [S] `docs/src/lib/components/docs-copy-page.svelte:36-40` — no status check before `clipboard.copy`.
- [S] `docs/scripts/build-llms.ts:536` — `.md` files are emitted only into the Cloudflare build output.
- [O] `/docs/components/button` under `vite dev` → `.md` request 404, response body HTML; clipboard write failed in headless Chromium and the UI showed no error.
- [O] `curl https://shadcn-svelte.com/docs/components/button.md` and four other pages → `200 text/markdown`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged); checked=2026-10-20.
Gaps: GitHub search was rate-limited once; discussions and releases were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2761` — Distinct; open PR that only restyles `docs-copy-page.svelte`.
- `https://github.com/huntabyte/shadcn-svelte/issues/2365` — Related; earlier Copy Page work.
- `https://github.com/huntabyte/shadcn-svelte/issues/2502` — Related; earlier Copy Page work.
- `https://github.com/huntabyte/shadcn-svelte/issues/2503` — Related; earlier Copy Page work.

Contribution fit: New contribution — `copyPage()` owns the response handling; value is mostly for contributors running the docs locally.

## Proposed-Change

Show an error toast and skip copying when the response is not OK.

## Scope-and-Constraints

- Preserve: successful responses are copied as before.
- Exclude: serving `.md` routes under `vite dev` and network-error handling.
- Cost: low; may conflict textually with the open #2761.

## Verification

- Fix branch: Copy Page under `vite dev` → toast "Failed to copy page", clipboard keeps its previous value.
- Gap: the success path was not exercised because no `.md` route exists under `vite dev`.

## Publication-Blockers

- User approval of the exact draft and target.
- Value decision: production reach is unproven, so the user may prefer not to publish this.
- Disclosure decision: upstream asks that AI not write PR descriptions, which conflicts with the AI disclosure footer.

## Next-Action

Summary: Decide whether to publish
Action: Ask the user whether this dev-only hardening is worth an upstream PR.
Done-When: The user approves the draft or archives the finding as Not-Worth-Pursuing.

## Pull-Request-Implementation

Branch: `fix/docs-copy-page-response-check`
Base: `upstream/main@7e463da6`
Scope: `docs/src/lib/components/docs-copy-page.svelte` `copyPage()`.
Commit: `a965fc47`
Push: `origin/fix/docs-copy-page-response-check`
Checks:

- `pnpm exec oxfmt` and `pnpm exec eslint` on the changed file → clean.
- `pnpm -F docs check` → 0 errors, 0 warnings.
- Browser scenario in Verification → passed.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` `main` from `MikeeI/project-shacdn-svelte-fork:fix/docs-copy-page-response-check`
Title: fix: show an error when Copy Page can't load the markdown

Body:

```markdown
`copyPage()` copies whatever `${pageUrl}.md` returns without checking the status. When running the docs locally with `pnpm dev`, the `.md` routes don't exist (they're generated for the Cloudflare build), so it tries to copy the 404 HTML page and gives no feedback.

This shows an error toast for non-OK responses instead.
```
