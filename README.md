# ModernChimeraD20 for Foundry VTT

A public, MIT-licensed game system foundation for a futuristic tabletop roleplaying game. This is a development scaffold, not a playable rules release.

The initial slice provides a character profile using Foundry V14 typed data models and an ApplicationV2 sheet. No combat, attributes, classes, or resolution rules have been selected.

## Develop locally

Use Node 22.18+ (22.x) or 24.x and npm. The lockfile pins dependencies.

```sh
npm ci
npm run hooks:install
npm run check
npm run package
```

`dist/` is the installable system directory. `artifacts/` receives a ZIP, manifest, and checksums; building a package does not publish a release. See [local testing](docs/local-testing.md) for Docker and connected-user tests.

## Organization

| Path                             | Responsibility                                                       |
| -------------------------------- | -------------------------------------------------------------------- |
| `src/rules/`                     | Deterministic game rules, independent of Foundry; currently reserved |
| `src/foundry/data/`              | Persistent schemas and derived data                                  |
| `src/foundry/sheets/`            | Presentation and document updates                                    |
| `src/foundry/register.ts`        | Composition and registration                                         |
| `templates/`, `styles/`, `lang/` | UI and localization                                                  |
| `tests/unit/`                    | Fast tests without a Foundry license                                 |
| `tests/e2e/`                     | Real Foundry with isolated GM/player browser sessions                |
| `scripts/`                       | Build, package, and repository checks                                |

Read [architecture](docs/architecture.md), [reference-system lessons](docs/reference-systems.md), and [CONTRIBUTING](CONTRIBUTING.md). Public specifications and tests must be understandable without access to unpublished design material.

## Compatibility and licensing

The development target is Foundry V14, minimum 14.366. Only versions recorded in [test evidence](docs/test-evidence.md) are verified. Foundry itself is separately licensed and is never redistributed here.

Original code and developer documentation in this repository use [MIT](LICENSE). This does not grant rights to unpublished sourcebooks, setting, artwork, or trademarks, or change third-party licenses. No third-party game content is included.
