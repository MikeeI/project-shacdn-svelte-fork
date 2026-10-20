# ISSUE-013 — sv-addons/registry: template `complex-component` ships imports that do not resolve after install

State: Submitted
Authorized-Work: Research-and-Reporting
Publication-Target: New-issue
External-Reference: https://github.com/huntabyte/shadcn-svelte/issues/2935
Upstream-Repository: huntabyte/shadcn-svelte
Contribution-Priority: High
Root-Cause-Confidence: High
Finding-Category: Build
Created: 2026-10-20
Updated: 2026-10-20
Source: `upstream/main@160547e7`

## Root-Cause

Root-Cause [S]: The template's `complex-component` files import each other through `./components/...`, `./lib/...`, and `$lib/registry/blocks/...`, none of which the registry build rewrites to install-time aliases.

## Reach-and-Impact

Reach [S]: Every registry author who scaffolds `@shadcn-svelte/registry` and every consumer installing its sample item.
Impact [S]: Installed files land in the components, lib, and hooks aliases, so the page and card imports point to missing paths and the consumer build fails.

## Evidence

- [S] `sv-addons/registry/template/src/lib/registry/blocks/complex-component/+page.svelte:2-3` — `./components/pokemon-card.svelte`, `./lib/pokemon.js`.
- [S] `sv-addons/registry/template/src/lib/registry/blocks/complex-component/components/pokemon-card.svelte:2-4` and `pokemon-image.svelte:2` — `$lib/registry/blocks/complex-component/...`.
- [S] `packages/cli/src/commands/registry/build.ts:228-239` — only the five aliases become placeholders.
- [S] `packages/cli/test/registry-template.test.ts:149-205` — built snapshot keeps the original import strings.
- [O] `https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template-consumer` → `pnpm check` reports five `Cannot find module` errors for the unrewritten imports; environment=`shadcn-svelte@1.7.0`, `@shadcn-svelte/registry@0.1.1`.

## Prior-Art

Coverage: issues(open+closed), PRs(open+closed+merged) via `gh search` for "registry template complex-component"; checked=2026-10-20.
Gaps: discussions, releases, and Discord were not searched.

- None found.

Contribution fit: New issue — template source owns the sample imports; distinct from ISSUE-012, which owns page target resolution.
Routing: [S] shadcn-svelte `sv` add-on template.

## Proposed-Change

Rewrite the template imports to alias paths that the build maps to placeholders: `$lib/registry/components/...`, `$lib/registry/lib/...`, and `$lib/registry/hooks/...`, with matching file locations.

## Scope-and-Constraints

- Preserve: the template's demonstration of multi-file items.
- Exclude: generic relative-import rewriting in the CLI build.
- Cost: template restructuring plus the `registry-template.test.ts` snapshot update.

## Verification

- Build the template registry, install `complex-component` into a fresh app → `pnpm check` passes.

## Publication-Blockers

None.

## Next-Action

Summary: Monitor issue response
Action: Answer maintainer questions on https://github.com/huntabyte/shadcn-svelte/issues/2935 with new evidence only.
Done-When: The issue is closed or a fix is merged, and the record is archived.

## Publication-Draft

Target: `huntabyte/shadcn-svelte` new issue in the `3-bug_report.yml` field order, created with `gh issue create`; Severity `annoyance`; disclosure is the final section.
Title: Registry template: `complex-component` imports don't resolve after install

Body:

````markdown
### Describe the bug

The `@shadcn-svelte/registry` template's `complex-component` imports its own files with paths the registry build doesn't rewrite:

- `+page.svelte`: `./components/pokemon-card.svelte` and `./lib/pokemon.js`
- `pokemon-card.svelte` / `pokemon-image.svelte`: `$lib/registry/blocks/complex-component/...`

`transformAliases` in `registry build` only maps the `components`, `ui`, `hooks`, `lib`, and `utils` aliases, so these strings ship unchanged. The `registry-template.test.ts` snapshot shows them too. On install, the files go into the components, lib, and hooks aliases, so none of these imports resolve in the consumer project. That makes the template's sample multi-file item fail `svelte-check` and the build right after install.

**Possible fix:** move the sample files under aliased registry folders and import them through `$lib/registry/components/...`, `$lib/registry/lib/...`, and `$lib/registry/hooks/...`, so the build turns them into placeholders.

(The page target from the same item also lands in `src/routes/src/routes/`. That has a different cause and is reported in #2934.)

### Reproduction

https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template-consumer

The registry was created with `sv create ... --add "@shadcn-svelte/registry"` and built unmodified ([`registry-template`](https://github.com/MikeeI/shadcn-svelte-repros/tree/main/registry-template)). The consumer is the official `repro` template:

```bash
pnpm install
pnpm dlx shadcn-svelte@latest add https://raw.githubusercontent.com/MikeeI/shadcn-svelte-repros/main/registry-template/static/r/complex-component.json --yes --overwrite
pnpm check
```

### Logs

```bash
ERROR "src/lib/components/pokemon-card.svelte" 2:29 "Cannot find module '$lib/registry/blocks/complex-component/lib/pokemon.js' or its corresponding type declarations."
ERROR "src/lib/components/pokemon-card.svelte" 4:27 "Cannot find module '$lib/registry/blocks/complex-component/components/pokemon-image.svelte' or its corresponding type declarations."
ERROR "src/lib/components/pokemon-image.svelte" 2:34 "Cannot find module '$lib/registry/blocks/complex-component/hooks/use-pokemon.svelte' or its corresponding type declarations."
ERROR "src/routes/src/routes/pokemon/+page.svelte" 2:26 "Cannot find module './components/pokemon-card.svelte' or its corresponding type declarations."
ERROR "src/routes/src/routes/pokemon/+page.svelte" 3:33 "Cannot find module './lib/pokemon.js' or its corresponding type declarations."
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
