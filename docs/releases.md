# Releases

No release is published by a push, pull request, or package build. The first release remains pending game design and runtime verification.

1. Update `package.json`, the lockfile, and `system.json` to the same reviewed version. Record supported/verified Foundry builds accurately.
2. Run `npm run check`, local real-runtime tests, and `npm run package`. Inspect the ZIP and `SHA256SUMS`; only redistributable assets may be included.
3. Merge the reviewed change through the protected branch. Create `v<version>` at that exact main commit. Release tags are maintainer-controlled and must not be moved or deleted.
4. Create a draft GitHub release from that tag and attach `artifacts/system.json`, `artifacts/modern-chimera-d20.zip`, and `artifacts/SHA256SUMS`.
5. Check that manifest version, download URL, tag, and ZIP contents agree, then publish deliberately. Mark experimental versions as prereleases; `releases/latest` points to stable releases, so prerelease testers should use the version-specific manifest URL.

Do not publish licensed Foundry runtime files, world data, private manuscript sources, credentials, or local development instructions. Original code remains MIT; content needs its own explicit license/provenance.
