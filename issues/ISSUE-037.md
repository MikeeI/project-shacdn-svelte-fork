# ISSUE-037 — docs: orphaned demo cards, examples barrel, and helper components have no importers

State: Draft-Ready
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: Not published.
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: Low
Root-Cause-Confidence: High
Finding-Category: Maintainability
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@97fdb936`

## Root-Cause

Root-Cause [S]: Homepage and docs redesigns replaced `cards/demo.svelte`, `cards/root-components.svelte`, and several small docs components, but the replaced files and the examples barrel that only they import stayed in `docs/src/lib`.

## Reach-and-Impact

Reach [S]: Docs-site source only; no route, content page, or registry item imports these files.
Impact [S]: About 1,116 dead lines in 14 files that still go through `svelte-check`, formatting, and upstream example syncs.
Impact [S]: Users see no difference; the value is maintenance only.

## Evidence

- [S] `docs/src/lib/components/cards/demo.svelte:1-61` and `root-components.svelte:1-57` — near-identical files with no importer.
- [S] `docs/src/lib/components/cards/demo.svelte:14-20` — only importers (with `root-components.svelte:14-20`) of `appearance-settings` (134), `notion-prompt-form` (374), `field-checkbox` (13), `field-hear` (57), `input-group-button-demo` (48), `item-demo` (35), `nested` (22).
- [S] `docs/src/lib/components/cards/input-demo.svelte:1-35` — no importer.
- [S] `docs/src/lib/registry/examples/index.ts:1-213` — only importers are `demo.svelte:12` and `root-components.svelte:12`; `crawlExamples` reads only `.svelte` files (`docs/scripts/registry.ts:95-97`).
- [S] `docs/src/lib/components/og.svelte:1-51` — no importer; `routes/og/+server.ts:4-9` redirects to `https://og.shadcn-svelte.com`.
- [S] `docs/src/lib/components/tab.svelte:1-10` and `pm-upgrade.svelte:1-6` — no importer in source or content.
- [S] `docs/src/lib/components/cards/cards-demo.svelte` stays live through `routes/(app)/(layout)/themes/+page.svelte:2`.
- [O] `git grep` at `97fdb936` over `docs` (excluding `docs/static`) for these file names hits only `demo.svelte` and `root-components.svelte`.

## Prior-Art

Coverage: issues and PRs (open and closed) via `gh search` for "unused", "dead code", "remove unused files", "unused component docs"; open PR file lists of #2774 and #2909 checked; checked=2026-10-20.
Gaps: discussions and Discord were not searched.

- huntabyte/shadcn-svelte#2761 — merged homepage rework; related, leaves these files untouched.
- huntabyte/shadcn-svelte#1753 — merged `next: cleanup dead code`; related precedent, different files.

Contribution fit: New issue — docs-site source owns these files; the bug form is the only available form, with Severity `annoyance`.
Routing: [S] shadcn-svelte docs-site code.

## Proposed-Change

Delete the ten `cards/` files listed in Evidence, `registry/examples/index.ts`, `og.svelte`, `tab.svelte`, and `pm-upgrade.svelte`.

## Scope-and-Constraints

- Preserve: `cards-demo.svelte` and its twelve cards, every example `.svelte` file, and every rendered page.
- Exclude: examples that only `examples/index.ts` re-exports; whether they should be wired into docs is a separate question.
- Cost: [A] `og.svelte` may serve as a template for the external OG service; maintainers can confirm.

## Verification

- `pnpm -F docs check` → passes.
- Render `/` and `/themes` → unchanged.

## Publication-Blockers

None.

## Next-Action

Summary: Await draft approval
Action: Show the exact draft and target to the user and publish only after approval.
Done-When: The user approves and the issue URL is recorded, or the user declines and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order; Severity `annoyance`; disclosure is the final section.
Title: docs: unused demo cards, `examples/index.ts` and helper components can be removed

Body:

````markdown
### Describe the bug

These docs-site files have no importers at 97fdb93:

- `docs/src/lib/components/cards/demo.svelte` and `cards/root-components.svelte` (near-identical).
  They are the only importers of seven cards in the same folder: `appearance-settings`, `notion-prompt-form`, `field-checkbox`, `field-hear`, `input-group-button-demo`, `item-demo`, `nested`.
- `docs/src/lib/components/cards/input-demo.svelte`.
- `docs/src/lib/registry/examples/index.ts` (213 re-exports), imported only by the two files above.
- `docs/src/lib/components/og.svelte`; the `/og` route redirects to `og.shadcn-svelte.com`.
- `docs/src/lib/components/tab.svelte` and `docs/src/lib/components/pm-upgrade.svelte`.

`cards/cards-demo.svelte` and its cards are still used by `/themes`, so they stay.

**Possible fix:** delete the 14 files.
That removes about 1,100 lines without changing any page.
If `og.svelte` is kept as a template for the OG image service, it can stay.

### Reproduction

Nothing renders these files, so there is no runtime reproduction.
On commit 97fdb9364926716d33b3c5570ae3a84dd6493428:

```bash
git grep -nE 'cards/(demo|root-components|input-demo)|registry/examples/index|components/og|/og\.svelte|/tab\.svelte|pm-upgrade' -- docs ':!docs/static'
```

The only hits are the `examples/index.js` imports in `demo.svelte:12` and `root-components.svelte:12`.

### System Info

Not applicable (repository source at 97fdb93).

### Severity

annoyance

### Disclosure

Investigated thoroughly with Claude Opus 5.5 (medium reasoning effort), using [Oh My Pi](https://github.com/can1357/oh-my-pi) as the agent framework.
I thoroughly reviewed this contribution with Claude Opus 5.5 (medium reasoning effort).

This report is not generic or unreviewed AI-generated output. Its claims were checked against the cited evidence, and it includes the relevant detail intended to help maintainers resolve the issue.

If reports like this are not useful to the project, please let me know and I will refrain from submitting similar ones. My intent is to help without wasting maintainer time or energy or discouraging their work.

Thank you for your work.
````
