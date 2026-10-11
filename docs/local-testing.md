# Local development and testing

## Fast checks

```sh
npm ci
npm run hooks:install
npm run check
npm run package
```

The unit tests require no license or server. They validate the package and repository policies; gameplay tests will arrive with accepted rules. `npm run dev` watches TypeScript. Re-run `npm run build` after changing templates, styles, language files, or the manifest; refresh connected browsers after rebuilding.

For Linux checks in a disposable container, stage intended source files first, then run:

```sh
docker compose -f compose.checks.yaml run --rm checks
```

Only Git-listed source files are copied into the container's temporary workspace. The source mount is read-only; ignored credentials, world data, and dependencies are not copied. Changes to tracked working files are included. This tests the current working content, not proof of a particular committed revision.

## Licensed Foundry runtime

1. Run `npm run build`.
2. Run `npm run local:prepare`, then create `.local/config.json` locally. The prepare step creates nested mount parents before Docker can create them as root. Supply `foundry_username`, `foundry_password`, and a separate `foundry_admin_key` as JSON string properties. Keep the file access-restricted. Alternatively configure the container using the upstream documented timed download URL workflow. Never put a credential or signed URL into tracked files, issue reports, or command output.
3. Run `docker compose up -d`, then `docker compose ps`. The first start downloads the licensed distribution.
4. Open `http://127.0.0.1:30020`. Create a disposable world with ID `mcd20-dev` and select ModernChimeraD20. No production world is needed.
5. In that world create users named `Test GM` (Gamemaster), `Test Owner` (Player), and `Test Observer` (Player). Leave their world passwords empty for this loopback-only test fixture, or set the same password and provide it through the local `FOUNDRY_E2E_PASSWORD` environment variable. Keep the server administration password separate.
6. Launch the world and leave it available at the join page.
7. Run `npx playwright install chromium`, then `npm run test:e2e`.

The suite refuses non-loopback URLs and checks the world/system IDs before creating or updating documents. It joins three independent browser sessions, uses a real character sheet, verifies synchronization and reload persistence, attempts an unauthorized observer update, and removes its actor afterward. A missing server, world, or user fails the test; it is never a skipped success.

These profile clients disable the GPU canvas using Foundry's `core.noCanvas` setting. Canvas behavior needs a separate suite with suitable graphics support; this check makes no canvas compatibility claim. It accepts the normal reload confirmation and dismisses first-login player configuration when present.

After stopping a local server, allow its data-directory lock to expire before immediately starting it again if Foundry reports a stale lock. Never remove a lock while another instance may own the directory. If a test is forcibly interrupted before cleanup, remove only its `E2E Profile` fixture actors from this disposable world before the next run.

`test-results/` contains local failure diagnostics and can contain test-world content. It is ignored. Do not publish traces without review. Run `docker compose down` to stop the server without deleting `.local/data/`. Never share a live world's data directory between containers.

The runtime defaults to pinned Foundry 14.368 for reproducibility. Test newer releases deliberately before updating the pin and compatibility evidence. Only the owner's local test clients should access this server while the same license is used by another accessible instance; consult [Foundry's license](https://foundryvtt.com/article/license/) before inviting external testers.
