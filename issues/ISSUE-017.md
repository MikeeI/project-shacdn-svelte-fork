# ISSUE-017 — cli/css: dark `@custom-variant` is skipped when any other `@custom-variant` exists

State: Draft-Ready
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

Root-Cause [S]: `addCustomVariant` treats any top-level `@custom-variant` as the dark variant and skips inserting `dark (&:is(.dark *))`.

## Reach-and-Impact

Reach [S]: `init`, `add`, and `apply` on stylesheets that already define an unrelated `@custom-variant` before dark vars are written.
Impact [A]: `.dark` CSS variables follow the class while `dark:` utilities follow `prefers-color-scheme`, so class-based dark mode renders inconsistently.

## Evidence

- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:71-73` — finds any `custom-variant` at-rule by name only.
- [S] `packages/cli/src/utils/updaters/update-css-vars.ts:6,23-27` — intended params `dark (&:is(.dark *))` when dark vars exist.
- [S] `packages/cli/src/tailwind.css` — defines data-state variants but no `dark` variant.
- [S] `shadcn-ui/ui` `packages/registry/src/updaters/update-css-vars.ts:513-520` — same name-only check; tracked separately as ISSUE-035.
- [O] `shadcn-svelte@1.7.0`, SvelteKit 3.1.0 + Tailwind 4.3.3, Node 26.12.0: `init --preset b0` on a `layout.css` containing `@custom-variant sidebar-open (&:is(.sidebar-open *));` wrote `.dark { ... }` but no `@custom-variant dark`; the same init on the plain `sv` stylesheet adds it.
- [O] Repository: https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-variant-dark

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "custom-variant dark"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- `https://github.com/huntabyte/shadcn-svelte/issues/2044` — Distinct; earlier missing dark-mode CSS for Tailwind v4, not this check.
- `https://github.com/huntabyte/shadcn-svelte/issues/2612` — Related; closed 2026-04-01; the CLI duplicated existing `@custom-variant` rules; [A] the name-only check likely came from that fix and now fails the other way.

Contribution fit: New issue — the CSS updater owns the dark variant insertion.

## Proposed-Change

Match only `custom-variant` rules whose params start with `dark`.

## Scope-and-Constraints

- Preserve: existing user-defined dark variants stay untouched.
- Exclude: other variant handling.
- Cost: one predicate change.

## Verification

- `transformCss` on `@import "tailwindcss";\n@custom-variant hocus (&:hover, &:focus);` with `cssVars.dark` → output contains `@custom-variant dark (&:is(.dark *));`.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves or rejects the exact current draft and target.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: CLI doesn't add the `dark` custom variant when the stylesheet already has another `@custom-variant`

Body:

````markdown
### Describe the bug

`addCustomVariant` (`packages/cli/src/utils/updaters/update-css-vars.ts`) is supposed to add `@custom-variant dark (&:is(.dark *));` when dark CSS variables are written. It checks for an existing rule by name only (`node.name === "custom-variant"`), so any unrelated variant, e.g. `@custom-variant hocus (&:hover, &:focus);`, makes it skip the dark variant. The `.dark { ... }` variables are still written, but `dark:` utilities then follow `prefers-color-scheme` instead of the `.dark` class.

**Possible fix:** only treat a `custom-variant` rule as existing when its params start with `dark`.

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/cli-custom-variant-dark

`src/routes/layout.css` starts with `@import "tailwindcss";` and `@custom-variant sidebar-open (&:is(.sidebar-open *));`.
After `pnpm dlx shadcn-svelte@latest init --preset b0 ...` it contains the `.dark { ... }` block, but no `@custom-variant dark (&:is(.dark *));`.

### System Info

```text
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
  CPU: (32) x64 AMD Ryzen 9 5950X 16-Core Processor
  Shell: 5.2.21 - /bin/bash
Binaries:
  Node: 26.12.0 - /usr/bin/node
  npm: 12.2.0 - /usr/bin/npm
  pnpm: 10.32.1 - /usr/bin/pnpm
npmPackages:
  @lucide/svelte: ^1.60.0 => 1.60.0
  @sveltejs/kit: ^3.0.0 => 3.1.0
  shadcn-svelte: ^1.7.0 => 1.7.0
  svelte: ^5.57.1 => 5.57.2
  tailwindcss: ^4.3.0 => 4.3.3
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
