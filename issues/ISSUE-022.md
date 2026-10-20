# ISSUE-022 — cli: dependency install is silently skipped when no package manager is detected

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
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `installDependencies` returns without writing or reporting dependencies when `detectPM` finds no package manager and prompting is disabled.

## Reach-and-Impact

Reach [S]: `apply` (always `prompt: false`) in projects without a lockfile or `packageManager` field.
Impact [S]: The CLI reports success while imported packages (fonts, icons, `tw-animate-css`) are missing.

## Evidence

- [S] `packages/cli/src/utils/install-deps.ts:87` — `if (!pm) return;`.
- [S] `packages/cli/src/commands/apply/index.ts:148-155` — `prompt: false`.
- [S] `packages/cli/src/utils/auto-detect.ts:105-126` — returns `undefined` without a lockfile or `packageManager`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "package manager not detected dependencies"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — rare trigger; `installDependencies` owns the fallback.

## Proposed-Change

When no package manager is found, write the dependencies to `package.json` (as `--no-deps-install` does) or log them as a warning.

## Scope-and-Constraints

- Preserve: interactive `add` where the user chooses "None".
- Exclude: package-manager detection rules.
- Cost: small branch change.

## Verification

- Project without a lockfile → `apply <preset>` → dependencies appear in `package.json` or a warning lists them.

## Publication-Blockers

- [O] Reproduction in a project without a lockfile.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Run `apply` in a project without a lockfile and record the silent skip, repository URL, and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed output, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `apply` silently skips dependencies when no package manager is detected

Body:

````markdown
### Describe the bug

`apply` calls `installDependencies` with `prompt: false`. If `detectPM` finds no lockfile and no `packageManager` field, `installDependencies` hits `if (!pm) return;` and returns without installing, writing to `package.json`, or printing anything. The CLI still reports success, but the CSS and components import packages (fonts, icon libraries, `tw-animate-css`) that were never added.

**Possible fix:** when no package manager is detected, fall back to writing the dependencies to `package.json` (like `--no-deps-install`), or at least warn and list them.

### Reproduction

Pending: repository link.

### System Info

Pending: envinfo output.

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I reviewed this contribution with Claude Opus 5.5 at medium reasoning effort.

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
