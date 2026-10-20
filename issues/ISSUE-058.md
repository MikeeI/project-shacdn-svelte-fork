# ISSUE-058 — cli+parity: SIGINT and SIGTERM exit with status 0

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
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: Both entry points install `process.on("SIGINT"|"SIGTERM", () => process.exit(0))`, turning interruption into success.

## Reach-and-Impact

Reach [S]: Scripts and CI that run `shadcn-svelte` or `pnpm parity --check` and get interrupted.
Impact [O]: Interrupted runs report success; for `parity --check`, an interrupted comparison passes the gate.

## Evidence

- [S] `packages/cli/src/index.ts:7-8` — handlers exit 0.
- [S] `packages/parity/src/index.ts:7-8` — same handlers.
- [O] `shadcn-svelte@1.7.0`, Node 26.12.0: Ctrl+C at the `add` component picker printed `Operation cancelled.` and `exit=0`; SIGTERM to the Node PID also gave 0.
- [O] `97fdb93`: `parity base carousel --refresh --check` interrupted by SIGINT and SIGTERM after `Comparing UI source` exited 0 without printing `## Summary`.
- [O] Scripts: https://github.com/MikeeI/shadcn-svelte-repros/blob/main/cli-scripts/sigint-exits-zero.sh and https://github.com/MikeeI/shadcn-svelte-repros/blob/main/parity/signal-exits-zero.sh

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "SIGINT exit code"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `shadcn-ui/ui` `packages/shadcn/src/index.ts:20-21` — identical handlers; the CLI half is inherited from shadcn/ui.

Contribution fit: Undecided — the CLI half mirrors shadcn/ui and may be declined as intended; the parity `--check` half is port-local and stronger.

## Proposed-Change

Exit with 130 for SIGINT and 143 for SIGTERM, at least in `parity`.

## Scope-and-Constraints

- Preserve: clean prompt cancellation output.
- Exclude: clack's own cancel handling.
- Cost: two lines per entry point.

## Verification

- Reproduction scripts → non-zero exit codes.

## Publication-Blockers

- User decision whether this low-value, partly inherited behavior is worth a report, and whether to limit it to `parity --check`.

## Next-Action

Summary: Decide publication value
Action: Ask the user whether to report the parity `--check` half, both halves, or archive as Not-Worth-Pursuing.
Done-When: The record states the chosen scope with a draft, or is archived.
