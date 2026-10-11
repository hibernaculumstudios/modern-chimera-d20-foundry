# Lessons from established systems

Reviewed 2026-10-10. These are patterns studied, not copied game code, content, or claims about private repository settings.

| Reference                                                                                  | Concrete observation                                                                                                       | Adoption here                                                                                                                           |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [PF2e](https://github.com/foundryvtt/pf2e/tree/1c0cd6822651c36de19d2ba8f22ad5f2e1205feb)   | TypeScript, Vitest, dedicated build scripts, test fixtures/mocks, and pack builds                                          | Strict TypeScript, tests separated by boundary, text pack sources when content exists; avoid adopting the whole mature engine           |
| [D&D5e](https://github.com/foundryvtt/dnd5e/tree/10d00807d854e85e02e4e6e142d8a742748c1102) | Distinct data/documents/applications/rules, registration module, pack source workflow, separate software/content licensing | Small composition root, separate schema/UI concerns, explicit licensing and packaging                                                   |
| [DCC](https://github.com/foundryvtt-dcc/dcc/tree/dbdaa1f694cbdbf5e4e1b61efc766bbc9bf5f837) | Separate unit and real-Foundry integration test projects and local runtime setup                                           | Fast license-free checks plus an explicit licensed-runtime suite; requested runtime tests must fail when unavailable, not silently skip |

Primary files inspected include each repository's `package.json`, PF2e's Vitest/CI configuration, DCC's Vitest configuration, and D&D5e's module organization and contribution documentation.

[Foundry's V14 data model API](https://foundryvtt.com/api/v14/classes/foundry.abstract.TypeDataModel.html) and [ActorSheetV2 API](https://foundryvtt.com/api/v14/classes/foundry.applications.sheets.ActorSheetV2.html) establish the integration boundaries. [Playwright browser contexts](https://playwright.dev/docs/browser-contexts) provide isolated sessions for connected-user checks.

The [Felddy container](https://github.com/felddy/foundryvtt-docker) obtains licensed software at runtime rather than redistributing it. The local Compose file pins an image digest and binds the server to loopback. Credentials are supplied through an ignored secret file, never committed or provided to public pull-request jobs.
