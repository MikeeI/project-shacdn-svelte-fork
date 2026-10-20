# ISSUE-014 — registry/blocks: `calendar-28` stores typed dates one month early

State: Submitted
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2936
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `calendar-28` passes the 0-based `Date.getMonth()` to `CalendarDate`, which expects months 1–12.

## Reach-and-Impact

Reach [S]: Every installed `calendar-28` block when the user types a date into the input.
Impact [O]: February–December dates are stored one month early, and day overflow is clamped; January is correct only because month 0 is clamped to 1.

## Evidence

- [S] `docs/src/lib/registry/blocks/calendar-28.svelte:44` — `new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate())`.
- [O] Node with `@internationalized/date` from the docs workspace: `June 01, 2025` → `2025-05-01`; `March 31, 2025` → `2025-02-28`; `January 15, 2025` → `2025-01-15`.
- [S] `shadcn-ui/ui` `apps/v4/public/r/styles/new-york/calendar-28.json` stores a native `Date`, so the defect is port-specific.
- [O] `https://github.com/MikeeI/shadcn-svelte-repros/tree/main/calendar-28-month-offset` → headless Chromium types `August 15, 2025`, selected day `2025-07-15`; environment=`shadcn-svelte@1.7.0`, Chromium headless shell 151.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "calendar-28"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/pull/2732` — Related; open calendar refactor touches `calendar-28.svelte` but not the `CalendarDate` construction.

Contribution fit: New issue — the block owns the conversion.

## Proposed-Change

Pass `date.getMonth() + 1`.

## Scope-and-Constraints

- Preserve: input text and calendar selection sync.
- Exclude: date parsing rules of `new Date(v)`.
- Cost: one-line change.

## Verification

- Type `June 01, 2025` into `calendar-28` → the calendar selects June 1, 2025.

## Publication-Blockers

None.

## Next-Action

Summary: Monitor issue response
Action: Answer maintainer questions on https://github.com/huntabyte/shadcn-svelte/issues/2936 with new evidence only.
Done-When: The issue is closed or a fix is merged, and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order, created with `gh issue create`; Severity `annoyance`; disclosure is the final section.
Title: `calendar-28` block selects the previous month when a date is typed

Body:

````markdown
### Describe the bug

`calendar-28` converts the typed text with:

```ts
value = new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
```

`Date.getMonth()` is 0-based, but `CalendarDate` expects months 1–12, so a typed date selects the same day of the previous month. Day overflow gets clamped, and January only works because month `0` is clamped to `1`:

- `August 15, 2025` → `2025-07-15`
- `June 01, 2025` → `2025-05-01`
- `March 31, 2025` → `2025-02-28`
- `January 15, 2025` → `2025-01-15`

The shadcn/ui version stores a native `Date`, so this only affects the Svelte port.

**Possible fix:** `new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/calendar-28-month-offset

The official `repro` template plus the unmodified `calendar-28` block:

1. `pnpm install && pnpm dev`
2. Type `August 15, 2025` into the input.
3. Open the calendar: July 15, 2025 is selected.

### Logs

```bash
# headless Chromium: selected day after typing "August 15, 2025"
{"typed":"August 15, 2025","selected":"2025-07-15"}
```

### System Info

```bash
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
  CPU: (32) x64 AMD Ryzen 9 5950X 16-Core Processor
Binaries:
  Node: 26.12.0 - /usr/bin/node
  pnpm: 10.34.7 - /usr/bin/pnpm
Browsers:
  Chromium headless shell: 151.0.7922.34
npmPackages:
  @internationalized/date: ^3.12.0 => 3.12.4
  @sveltejs/kit: 2.70.1 => 2.70.1
  bits-ui: ^2.18.0 => 2.19.5
  svelte: ^5.55.7 => 5.57.2
  tailwindcss: ^4.3.3 => 4.3.3
shadcn-svelte CLI: 1.7.0 (via pnpm dlx)
```

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
