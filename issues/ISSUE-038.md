# ISSUE-038 — docs/charts: every chart-type page inlines all 70 highlighted chart blocks

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Performance
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: `charts/[t]/+page.server.ts` lists every `chart-*` registry JSON regardless of `t`, and `+page.ts` fetches all of them, although `+page.svelte` renders only `charts[data.type]` from `charts.ts`.

## Reach-and-Impact

Reach [S]: All seven prerendered pages `/charts/area`, `bar`, `line`, `pie`, `radar`, `radial`, `tooltip`.
Impact [O]: Each page's HTML carries 70 inlined `/api/block/chart-*` responses although it shows at most 12 charts.
Impact [O]: The compressed transfer is small (about 34 KB), so the cost is mainly the 2.7 MB HTML document that browsers decompress, parse, and hydrate, plus prerender work.
Impact [S]: `chartTypes` is hard-coded in both load files and duplicates the keys of `charts.ts`.

## Evidence

- [S] `docs/src/routes/(app)/(layout)/charts/[t]/+page.server.ts:4,6,13-17` — `chartTypes` constant and a glob over all `chart-*.json`, returned for every `t`.
- [S] `docs/src/routes/(app)/(layout)/charts/[t]/+page.ts:4,13-23` — duplicate `chartTypes`; fetches `/api/block/${chart}` for every listed chart.
- [S] `docs/src/routes/(app)/(layout)/charts/[t]/+page.svelte:8,18-25` — renders only `charts[data.type]`, at most 12 slots.
- [S] `docs/src/lib/components/chart-display.svelte:17` — looks up its chart by name in `chartData`; other entries are never read.
- [S] `docs/src/routes/(app)/(layout)/charts/charts.ts` — owns the 68 rendered chart ids per type.

## Performance-Evidence

Measurement: `curl` against `https://shadcn-svelte.com` on 2026-10-20 (Cloudflare `cf-cache-status: HIT`), HTML parsed in Python.

| Page | HTML bytes | Inlined `chart-*` blocks | Inlined bytes | Blocks for this type | Bytes for this type |
| --- | --- | --- | --- | --- | --- |
| `/charts/area` | 2,724,606 | 70 | 2,595,373 | 10 | 463,340 |
| `/charts/tooltip` | 2,708,159 | 70 | 2,595,373 | 9 | 283,442 |

- [O] With `Accept-Encoding: br, gzip`, `/charts/area` transfers 34,229 bytes and `/charts/tooltip` 33,726 bytes.
- [O] Fetched ids not in `charts.ts`: `chart-pie-separator-none`, `chart-radial-grid`.
- Not measured: browser parse, hydration, or memory time.

## Prior-Art

Coverage: issues and PRs (open and closed) via `gh search` for "charts page slow", "charts html size", "charts payload", "api/block"; open PR #2774 file list checked; checked=2026-10-20.
Gaps: discussions and Discord were not searched.

- huntabyte/shadcn-svelte#2774 — open `docs: charts animations & example chrome`; related, edits `charts.ts` and `chart-display.svelte` but not the `[t]` loads.
- huntabyte/shadcn-svelte#2890 — merged dev-server performance fix; distinct.

Contribution fit: New issue — the docs route loads own the over-fetch.
Routing: [S] shadcn-svelte docs-site routing with no shadcn/ui counterpart.

## Proposed-Change

Delete `charts/[t]/+page.server.ts`.
In `+page.ts`, derive `entries` from `Object.keys(charts)` and fetch only `charts[params.t].map((c) => c.id)`.

## Scope-and-Constraints

- Preserve: URLs, prerendering, rendered markup, and chart order.
- Constraint: `/api/block/[block]/+server.ts` has no `entries`, so `chart-pie-separator-none` and `chart-radial-grid` stop being prerendered unless maintainers keep them.
- Exclude: `charts.ts` content and the `/api/block` handler.

## Verification

- Prerender `/charts/area` → 10 inlined chart blocks and the same rendered charts as before.
- `pnpm -F docs check` → passes.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves and the issue URL is recorded, or the user declines and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: docs: each `/charts/*` page inlines all 70 chart blocks (2.7 MB HTML) but shows at most 12

Body:

````markdown
### Describe the bug

`/charts/[t]/+page.server.ts` globs every `chart-*.json` and returns the full list for every chart type, and `+page.ts` fetches `/api/block/...` for all of them.
`+page.svelte` only renders `charts[data.type]` from `charts.ts` (at most 12), and `ChartDisplay` only looks up its own chart in `chartData`.
Because the pages are prerendered, SvelteKit inlines every fetched response into the HTML.

Measured on https://shadcn-svelte.com today:

| Page | HTML | Inlined chart blocks | Needed |
| --- | --- | --- | --- |
| `/charts/area` | 2,724,606 bytes | 70 (2,595,373 bytes) | 10 (463,340 bytes) |
| `/charts/tooltip` | 2,708,159 bytes | 70 (2,595,373 bytes) | 9 (283,442 bytes) |

Compressed transfer is only about 34 KB, so this is mostly parse and hydration work in the browser plus prerender time, not bandwidth.
`chartTypes` is also hard-coded twice, duplicating the keys of `charts.ts`.

**Possible fix:** drop `+page.server.ts`, derive `entries` from `Object.keys(charts)` in `+page.ts`, and fetch only `charts[params.t]`.
`chart-pie-separator-none` and `chart-radial-grid` are fetched today but not listed in `charts.ts`, so they would no longer be prerendered under `/api/block/` unless that's intended.

### Reproduction

```bash
curl -s https://shadcn-svelte.com/charts/area | grep -o 'data-url="/api/block/chart-' | wc -l
# 70
```

Source at 97fdb9364926716d33b3c5570ae3a84dd6493428: `docs/src/routes/(app)/(layout)/charts/[t]/+page.server.ts`, `+page.ts`, `+page.svelte`.

### System Info

Not applicable (production docs site, measured 2026-10-20).

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I thoroughly reviewed this contribution with Claude Opus 5.5 (medium reasoning effort).

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
