# Foundation verification

Verified 2026-10-10 against the foundation source introduced with this record. Subsequent changes require their own relevant evidence.

| Check                                                   | Environment                                                           | Result                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run check`                                         | Windows, Node 22.18.0                                                 | Strict types, lint, formatting, 25 unit/package-policy tests, build, and repository checks pass           |
| `docker compose -f compose.checks.yaml run --rm checks` | Pinned Debian/Node 22.18 container                                    | Same checks pass; 25 tests                                                                                |
| `npm run test:e2e`                                      | Local Foundry 14.368, Playwright Chromium, three independent contexts | Passed in about 8 seconds                                                                                 |
| `npm run package`                                       | Local build                                                           | Installable ZIP, matching manifest, and SHA-256 checksums produced; deterministic archive checked by test |
| `npm audit --omit=dev`                                  | Locked dependencies                                                   | No production dependency vulnerabilities reported                                                         |

The real-runtime scenario creates a profile with explicit GM/owner/observer permissions, edits the sheet, observes updates on other clients, reloads the owner client and checks persisted data, rejects an observer write, and verifies a disabled observer form. Script-like biography text remains plain text. The test deletes its own actor on successful completion.

The profile suite disables Foundry's GPU canvas through the client setting. It does not establish canvas, token, lighting, combat, or game-rule correctness. The initial canvas-enabled attempts timed out during software-rendered startup/reload; profile tests now use the appropriate no-canvas mode. No mechanics exist yet.

The packaging regression covers the extensionless LICENSE file, matching manifest paths, deterministic output, and rejection of unlisted files both at the output root and inside an asset directory. An initial package bug and first-run mount ownership issue were fixed before publication.

The full dependency audit has two moderate findings through a development-only dependency of the community type package; see [SECURITY](../SECURITY.md). No release has been published. Hosted CI results are attached to the GitHub commit and are separate from the local evidence above.
