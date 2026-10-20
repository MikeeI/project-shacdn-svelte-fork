# ISSUE-012 — cli/registry: documented `registry:page` targets install under `src/routes/src/routes/`

State: Submitted
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2934
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: API
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: The CLI resolves `registry:page` targets relative to `src/routes`, while the registry docs and the `@shadcn-svelte/registry` template write targets that already start with `src/routes/`.

## Reach-and-Impact

Reach [S]: Custom registries that follow the docs examples and every user of the template's `complex-component`.
Impact [S]: The page is written to `src/routes/src/routes/<route>/+page.svelte`, so the intended route does not exist.

## Evidence

- [S] `packages/cli/src/utils/registry/index.ts:219-224` — page alias dir is `<cwd>/src/routes` for SvelteKit.
- [S] `packages/cli/test/utils/registry.test.ts:282-301` — target `login/+page.svelte` resolves to `src/routes/login/+page.svelte`.
- [S] `docs/content/registry/registry-item-json.md:208`, `faq.md:23`, `examples.md:164` — targets `src/routes/hello/+page.svelte` and `src/routes/login/+page.svelte`.
- [S] `sv-addons/registry/template/registry.json:46` — target `src/routes/pokemon/+page.svelte`.
- [O] `https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template-consumer` → installing the template's `complex-component` from a raw GitHub URL writes `src/routes/src/routes/pokemon/+page.svelte`; environment=`shadcn-svelte@1.7.0`, `@shadcn-svelte/registry@0.1.1` via `sv@0.16.6`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry:page target" and "registry template complex-component"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — the docs/template contract and `resolveItemFilePath` disagree.
Routing: [S] SvelteKit route handling is shadcn-svelte-specific.

## Proposed-Change

Strip a leading `src/routes/` from `registry:page` targets in `resolveItemFilePath`, or change docs and template to routes-relative targets; maintainers choose the contract.

## Scope-and-Constraints

- Preserve: routes-relative targets such as `login/+page.svelte` and `~/` root-relative targets.
- Exclude: non-SvelteKit fallback to the components alias.
- Cost: CLI change keeps existing registries working; docs-only change breaks registries that copied the docs.

## Verification

- Install the template's `complex-component` into a SvelteKit app → file at `src/routes/pokemon/+page.svelte`, `/pokemon` renders.

## Publication-Blockers

None.

## Next-Action

Summary: Monitor issue response
Action: Answer maintainer questions on https://github.com/huntabyte/shadcn-svelte/issues/2934 with new evidence only.
Done-When: The issue is closed or a fix is merged, and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order, created with `gh issue create`; Severity `annoyance`; disclosure is the final section.
Title: `registry:page` targets from the docs and registry template are installed to `src/routes/src/routes/...`
Ledger note: `‹›` replace the published ASCII angle brackets because the ledger validator treats them as unfinished placeholders.

Body:

````markdown
### Describe the bug

The registry docs (`registry-item-json.md`, `faq.md`, `examples.md`) and the `@shadcn-svelte/registry` template use page targets that start with `src/routes/`, e.g. `"target": "src/routes/hello/+page.svelte"`. The CLI, however, resolves `registry:page` targets relative to `‹cwd›/src/routes` (`getItemAliasDir` in `packages/cli/src/utils/registry/index.ts`; the `login/+page.svelte` case in `test/utils/registry.test.ts` expects exactly that).

So following the docs writes the page to `src/routes/src/routes/hello/+page.svelte`. For the template's `complex-component`, `src/routes/pokemon/+page.svelte` ends up at `src/routes/src/routes/pokemon/+page.svelte`, and `/pokemon` doesn't exist.

**Possible fix:** either strip a leading `src/routes/` from page targets in `resolveItemFilePath`, which keeps registries that followed the docs working, or change the docs and the template to routes-relative targets like `hello/+page.svelte`.

(The template's `complex-component` also has imports that don't resolve after install. That's a separate cause, so I'll report it separately.)

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template-consumer

The registry was created with `sv create ... --add "@shadcn-svelte/registry"` and built unmodified ([`registry-template`](https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template)). The consumer is the official `repro` template:

```bash
pnpm install
pnpm dlx shadcn-svelte@latest add https://raw.githubusercontent.com/MikeeI/shadcn-svelte-repros/main/registry-template/static/r/complex-component.json --yes --overwrite
ls src/routes/src/routes/pokemon
```

### Logs

```bash
$ ls src/routes/src/routes/pokemon
+page.svelte
```

### System Info

```bash
System:
  OS: Linux 6.8 Ubuntu 24.04.5 LTS 24.04.5 LTS (Noble Numbat)
  CPU: (32) x64 AMD Ryzen 9 5950X 16-Core Processor
Binaries:
  Node: 26.12.0 - /usr/bin/node
  npm: 12.2.0 - /usr/bin/npm
  pnpm: 10.34.7 - /usr/bin/pnpm
npmPackages:
  @sveltejs/kit: 2.70.1 => 2.70.1
  bits-ui: ^2.18.0 => 2.19.5
  svelte: ^5.55.7 => 5.57.2
  tailwindcss: ^4.3.3 => 4.3.3
shadcn-svelte CLI: 1.7.0 (via pnpm dlx)
@shadcn-svelte/registry add-on: 0.1.1 (via sv 0.16.6)
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
