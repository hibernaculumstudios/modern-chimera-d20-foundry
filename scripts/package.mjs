import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { zipSync } from 'fflate';
import { validateManifest } from './manifest.mjs';
import { runtimeAssets } from './runtime-assets.mjs';

const manifest = JSON.parse(await readFile('dist/system.json', 'utf8'));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const requiredAssets = validateManifest(manifest, pkg.version);
for (const asset of requiredAssets) {
  if (!runtimeAssets.includes(asset))
    throw new Error(`Manifest references unapproved asset: ${asset}`);
}
const root = 'https://github.com/hibernaculumstudios/modern-chimera-d20-foundry';
manifest.manifest = `${root}/releases/latest/download/system.json`;
manifest.download = `${root}/releases/download/v${manifest.version}/modern-chimera-d20.zip`;
const files = {};
// The allowlist is independent of dist contents: stale/private files cannot ride a release.
for (const entry of runtimeAssets) {
  files[entry] = [await readFile(`dist/${entry}`), { mtime: new Date('2000-01-01T00:00:00Z') }];
}
const serialized = JSON.stringify(manifest, null, 2) + '\n';
files['system.json'] = [
  new TextEncoder().encode(serialized),
  { mtime: new Date('2000-01-01T00:00:00Z') },
];
await mkdir('artifacts', { recursive: true });
const archive = zipSync(files, { level: 9 });
await writeFile('artifacts/modern-chimera-d20.zip', archive);
await writeFile('artifacts/system.json', serialized);
await writeFile(
  'artifacts/SHA256SUMS',
  `${createHash('sha256').update(archive).digest('hex')}  modern-chimera-d20.zip\n${createHash('sha256').update(serialized).digest('hex')}  system.json\n`,
);
console.log(
  `Packaged ${Object.keys(files).length} assets for ${manifest.version}. No release was published.`,
);
