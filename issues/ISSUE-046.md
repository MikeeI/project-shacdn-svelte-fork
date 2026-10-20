# ISSUE-046 — sv-addons/sv: `execFileSync` without a shell cannot run `.cmd` package-manager shims on Windows

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: Medium
Finding-Category: Reliability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: The `@shadcn-svelte/sv` add-on runs the package-manager command with `execFileSync` and no `shell` option, which on Windows cannot start `npx.cmd`/`pnpm.cmd` shims.

## Reach-and-Impact

Reach [A]: `npx sv add @shadcn-svelte/sv` on Windows.
Impact [A]: The add-on fails with `ENOENT` or `EINVAL` before shadcn-svelte runs.

## Evidence

- [S] `sv-addons/sv/src/index.ts:52,60` — `execFileSync(command, args, ...)` without `shell: true`.
- [A] Node on Windows does not resolve `.cmd` extensions for `execFile*` without a shell, and refuses to spawn `.cmd`/`.bat` without `shell` since the CVE-2024-27980 fix.
- [O] Not reproducible on the Linux host; no Windows machine was available.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "sv add windows"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2857` — Related (weak); Windows user, different strip-types error.
- `https://github.com/huntabyte/shadcn-svelte/issues/2915` — Related (weak); `sv` peer mismatch on SvelteKit 3.

Contribution fit: New issue only after Windows confirmation.

## Proposed-Change

Use `shell: process.platform === "win32"` or a cross-platform spawner such as `tinyexec`/`x` that the CLI already uses.

## Scope-and-Constraints

- Preserve: Linux and macOS behavior.
- Exclude: other add-ons.
- Cost: one option or helper swap.

## Verification

- Windows 11, Node 22+: `npx sv add @shadcn-svelte/sv` completes.

## Publication-Blockers

- [O] Windows reproduction with the observed error output.
- `envinfo` output from the Windows machine.

## Next-Action

Summary: Verify on Windows
Action: Run `npx sv create` and `npx sv add @shadcn-svelte/sv` on Windows and record the error output and envinfo.
Done-When: The record contains the observed Windows result, or the finding is archived as invalid.
