# Issue and Pull Request Tracking

Read this index at the start of every agent session before repository work.
`FORMAT.md` owns research, lifecycle, drafting, implementation, and publication rules.
Each linked `issues/ISSUE-NNN.md` is the complete authoritative record for one root cause.
This file owns `Next finding ID` and projects current issue-file state.
`Next-Action` is the 2–6 word `Next-Action/Summary` projection from the issue record.
When a row disagrees with its issue file, correct the row from the issue file in the same task.
Findings target `huntabyte/shadcn-svelte` unless the Finding cell starts with another `[owner/repo]`.

Next finding ID: ISSUE-036

## Open-Findings

| ID | Finding | State | Authorized-Work | Publication-Target | Contribution-Priority | Next-Action | External-Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [ISSUE-002](issues/ISSUE-002.md) | docs/create: undo cannot get past a radius-constrained style change | PR-Ready | Pull-Request-Implementation | New-pull-request | High | Decide issue-first or PR | Not published. |
| [ISSUE-003](issues/ISSUE-003.md) | docs/create: leaving /create restores `style-vega` instead of the site style | PR-Ready | Pull-Request-Implementation | New-pull-request | High | Await draft approval | Not published. |
| [ISSUE-004](issues/ISSUE-004.md) | docs/create: Cmd/Ctrl+Z in text fields undoes the preset | PR-Ready | Pull-Request-Implementation | New-pull-request | Medium | Await draft approval | Not published. |
| [ISSUE-005](issues/ISSUE-005.md) | docs/colors: last copied swatch is never highlighted | PR-Ready | Pull-Request-Implementation | New-pull-request | Low | Await draft approval | Not published. |
| [ISSUE-006](issues/ISSUE-006.md) | docs: malformed foreign cookie breaks every page with a 500 | PR-Ready | Pull-Request-Implementation | New-pull-request | Low | Await draft approval | Not published. |
| [ISSUE-008](issues/ISSUE-008.md) | docs/create: randomize with a locked theme produces invalid base color pairs | PR-Ready | Pull-Request-Implementation | New-pull-request | Medium | Decide issue-first or PR | Not published. |
| [ISSUE-009](issues/ISSUE-009.md) | docs: Copy Page copies the error response when the Markdown route fails | PR-Ready | Pull-Request-Implementation | New-pull-request | Low | Decide whether to publish | Not published. |
| [ISSUE-010](issues/ISSUE-010.md) | cli: Tailwind v3 migration rewrites the style to `nova` and targets a 404 registry URL | Submitted | Research-and-Reporting | New-issue | High | Monitor issue response | https://github.com/huntabyte/shadcn-svelte/issues/2932 |
| [ISSUE-011](issues/ISSUE-011.md) | registry/blocks: relative `../ui/` imports break after installing three blocks | Submitted | Research-and-Reporting | New-issue | High | Monitor issue response | https://github.com/huntabyte/shadcn-svelte/issues/2933 |
| [ISSUE-012](issues/ISSUE-012.md) | cli/registry: documented `registry:page` targets install under `src/routes/src/routes/` | Submitted | Research-and-Reporting | New-issue | High | Monitor issue response | https://github.com/huntabyte/shadcn-svelte/issues/2934 |
| [ISSUE-013](issues/ISSUE-013.md) | sv-addons/registry: template `complex-component` ships imports that do not resolve after install | Submitted | Research-and-Reporting | New-issue | High | Monitor issue response | https://github.com/huntabyte/shadcn-svelte/issues/2935 |
| [ISSUE-014](issues/ISSUE-014.md) | registry/blocks: `calendar-28` stores typed dates one month early | Submitted | Research-and-Reporting | New-issue | High | Monitor issue response | https://github.com/huntabyte/shadcn-svelte/issues/2936 |
| [ISSUE-015](issues/ISSUE-015.md) | cli: JavaScript projects overwrite existing `.js` files without the overwrite prompt | Investigating | Research-and-Reporting | New-issue | Medium | Build runnable reproduction | Not published. |
| [ISSUE-016](issues/ISSUE-016.md) | cli: unversioned dependencies are reinstalled as `@latest` on every `add` | Investigating | Research-and-Reporting | New-issue | Medium | Build runnable reproduction | Not published. |
| [ISSUE-017](issues/ISSUE-017.md) | cli/css: dark `@custom-variant` is skipped when any other `@custom-variant` exists | Investigating | Research-and-Reporting | New-issue | Medium | Build runnable reproduction | Not published. |
| [ISSUE-018](issues/ISSUE-018.md) | registry/ui/carousel: navigation state goes stale after Embla `reInit` | Investigating | Research-and-Reporting | New-issue | Medium | Build runnable reproduction | Not published. |
| [ISSUE-019](issues/ISSUE-019.md) | registry/ui/form: `FormFieldErrors` throws on duplicate error messages | Investigating | Research-and-Reporting | New-issue | Medium | Build runnable reproduction | Not published. |
| [ISSUE-020](issues/ISSUE-020.md) | registry build: style class injection trims every double-quoted string in shipped files | Investigating | Research-and-Reporting | New-issue | Low | Decide publication value | Not published. |
| [ISSUE-021](issues/ISSUE-021.md) | cli/apply: `--only theme font` skips installing font packages | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-022](issues/ISSUE-022.md) | cli: dependency install is silently skipped when no package manager is detected | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-023](issues/ISSUE-023.md) | registry/ui/sonner: remixicon error and warning icons are swapped | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-024](issues/ISSUE-024.md) | registry/ui/calendar: multi-month dropdown captions format `placeholder` instead of each month | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-025](issues/ISSUE-025.md) | cli/update: item `css` and `cssVars` are never applied | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-026](issues/ISSUE-026.md) | cli: type stripping replaces the first `.ts` anywhere in the absolute path | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-027](issues/ISSUE-027.md) | cli/registry: circular `registryDependencies` recurse without bound | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-028](issues/ISSUE-028.md) | cli/registry: schema-valid `registry:item` fails with a raw `TODO` error | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-029](issues/ISSUE-029.md) | cli/apply: `components.json` is written before the preset is fetched | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-030](issues/ISSUE-030.md) | registry/ui/carousel: arrow-key navigation only works on the Prev/Next buttons | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-031](issues/ISSUE-031.md) | registry/blocks: `calendar-29` label points to an id the input does not have | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-032](issues/ISSUE-032.md) | sv-addons/registry: `registry.json` keeps `src/lib` paths when the lib directory is customized | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-033](issues/ISSUE-033.md) | cli/preset: v1 preset codes lose their colored chart palette | Investigating | Research-and-Reporting | New-issue | Low | Verify with v1 preset | Not published. |
| [ISSUE-034](issues/ISSUE-034.md) | registry/ui/field: `FieldError` shows duplicate messages that shadcn/ui deduplicates | Investigating | Research-and-Reporting | New-issue | Low | Build runnable reproduction | Not published. |
| [ISSUE-035](issues/ISSUE-035.md) | [shadcn-ui/ui] CLI: dark `@custom-variant` is skipped when any other `@custom-variant` exists | Investigating | Research-and-Reporting | New-issue | Low | Verify shadcn/ui behavior | Not published. |

## Archived-Findings

| ID | Finding | Authorized-Work | Publication-Target | Contribution-Priority | Archive-Reason | External-Reference |
| --- | --- | --- | --- | --- | --- | --- |
| [ISSUE-001](issues/archive/ISSUE-001.md) | docs/create: `inherit` heading font renders in Geist | Pull-Request-Implementation | New-pull-request | High | Merged | https://github.com/huntabyte/shadcn-svelte/pull/2931 |
| [ISSUE-007](issues/archive/ISSUE-007.md) | docs/registry: Lyra preset description says Tabler but uses Hugeicons | Pull-Request-Implementation | New-pull-request | Low | Finding-Invalidated | Not published. |
