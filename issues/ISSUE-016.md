# ISSUE-016 — cli: unversioned dependencies are reinstalled as `@latest` on every `add`

State: Investigating
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Medium
Root-Cause-Confidence: High
Finding-Category: Correctness
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: `parseDependency` assigns version `latest` to unversioned dependencies, and `mapNeededDep` checks `semver.satisfies(installed, "latest")`, which is always false.

## Reach-and-Impact

Reach [S]: Icon libraries, font packages, and base-item packages added without a version, on every `add`, `update`, `apply`, and `init`.
Impact [S]: Already installed packages are passed to the package manager as `<name>@latest`, which can move a pinned dependency across a major version.

## Evidence

- [S] `packages/cli/src/utils/install-deps.ts:54-57` — skip only when `semver.satisfies(depVersion, version)`.
- [S] `packages/cli/src/utils/install-deps.ts:324-341` — `version` defaults to `"latest"`.
- [O] `node -e` with the CLI's `semver`: `satisfies(coerce("^0.4.0"), "latest", {loose:true})` → `false`.
- [O] `blocks-relative-ui-imports` repro after `add` → `@lucide/svelte` resolved `^1.60.0` although the template pins `^0.562.0`; [A] attribution to this path is unverified.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "latest reinstall dependency add"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — `mapNeededDep` owns the skip decision.

## Proposed-Change

Treat a missing version or `latest` as satisfied when the package is already present in `dependencies` or `devDependencies`.

## Scope-and-Constraints

- Preserve: explicit version ranges still upgrade unsatisfied installs.
- Exclude: changing which packages registry items declare.
- Cost: small change in one function.

## Verification

- Project with `@lucide/svelte@^0.562.0` → `add button` twice → no `@lucide/svelte@latest` in the package manager call.

## Publication-Blockers

- [O] Reproduction showing the package-manager invocation or `package.json` change, as a repository link.
- `envinfo` output for the required System Info field.
- User approval of the exact draft and target.

## Next-Action

Summary: Build runnable reproduction
Action: Add a component twice in a project with a pinned icon package and record the package-manager call, repository URL, and envinfo in the draft.
Done-When: The draft contains a working reproduction link, observed version change, and envinfo.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: `add` reinstalls already-installed unversioned dependencies (icon libraries, fonts) as `@latest`

Body:

````markdown
### Describe the bug

`installDependencies` is meant to skip a dependency that is already installed and satisfies the requested version. But `parseDependency` gives every unversioned dependency the version `latest`, and `semver.satisfies(<installed>, "latest")` is always `false`. So icon libraries, font packages, and base-item packages without a version are passed to the package manager as `<name>@latest` on every `add`, even when they're already installed. That can move a pinned dependency across a major version.

**Possible fix:** in `mapNeededDep`, treat a missing version or `latest` as satisfied when the package is already in `dependencies` or `devDependencies`.

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
