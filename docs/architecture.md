# Architecture

The system starts with a character profile, not a predetermined game engine. Keep abstractions proportional to working features.

## Dependency direction

`sheets -> Foundry document operations -> schemas and pure rules`

`src/rules/` has no Foundry globals, DOM, storage, network, or implicit random source. Rules receive values and return results. No rules have been implemented yet. Add tests for accepted examples, boundaries, invalid input, and invariants with the first mechanic.

The Foundry adapter owns document reads/writes, dice evaluation, permissions, chat, and hooks. Use core document APIs so ownership and synchronization remain Foundry's responsibility. A client-side button being disabled is not authorization: test unauthorized updates through the document API as well. Do not add a custom socket protocol or trusted-GM execution service until a real requirement needs it.

One composition root registers models and sheets. Typed `TypeDataModel` schemas define persistent data; preparation computes derived state without writing to the database. Sheets display prepared values and submit changes through document APIs. Use ApplicationV2 and Handlebars; introduce a larger UI framework only when it solves demonstrated complexity.

## Persistence and compatibility

The first schema stores a plain-text biography. Template interpolation escapes it; it is not a trusted HTML field. When a persistent field changes, add a versioned migration with old-data fixtures and rerun tests twice to prove idempotence. Never silently delete unknown or invalid user data. Back up worlds before bulk migration and report failures.

Track game-rule revision, system package version, and Foundry compatibility independently. Do not mark a Foundry build `verified` until real-runtime evidence exists. Do not promise support for an older major version through untested compatibility branches.

Future packs should have stable document IDs and text source files under `packs/_source/`; compile databases during packaging. Preserve UUIDs and migration paths once users depend on them. Do not put LevelDB runtime databases, private books, or unreleased assets into source control.

## Testing and release boundaries

- Unit tests run without Foundry. The initial suite verifies package and repository safety; it does not pretend to test absent mechanics.
- Strict types check the adapter against a pinned community V14 declaration package. Beta typings are a useful check, not a replacement for runtime verification.
- Playwright connects separate GM, owner, and observer browser contexts to a disposable local world. The first scenario verifies real sheet submission, synchronization, reload persistence, and refused unauthorized edits.
- Container checks run tracked source on Linux without mounting writable source or licensed runtime data.
- Public CI checks Linux and Windows without secrets. Licensed runtime tests remain local until a separate trusted environment is justified.

Package only an explicit list of runtime assets. Review license/provenance before adding content. A release requires local runtime evidence, a matching version/tag, a reviewed package, and maintainer publication; passing CI alone does not publish anything.
