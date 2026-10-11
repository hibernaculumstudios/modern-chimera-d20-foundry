import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { unzipSync } from 'fflate';
import { expect, it } from 'vitest';

it('packages a deterministic installable archive without unexpected build output', () => {
  execFileSync(process.execPath, ['scripts/build.mjs']);
  const unexpected = 'dist/private-fixture.txt';
  const nestedUnexpected = 'dist/templates/private-fixture.txt';
  writeFileSync(unexpected, 'must not ship');
  writeFileSync(nestedUnexpected, 'must not ship');
  try {
    execFileSync(process.execPath, ['scripts/package.mjs']);
    const first = readFileSync('artifacts/modern-chimera-d20.zip');
    const files = unzipSync(first);
    expect(files).toHaveProperty('LICENSE');
    expect(files).not.toHaveProperty('private-fixture.txt');
    expect(files).not.toHaveProperty('templates/private-fixture.txt');
    const manifest = JSON.parse(new TextDecoder().decode(files['system.json']));
    expect(manifest.download).toContain(`/v${manifest.version}/modern-chimera-d20.zip`);
    for (const path of [
      ...manifest.esmodules,
      ...manifest.styles,
      ...manifest.languages.map((entry: { path: string }) => entry.path),
    ]) {
      expect(files[path]).toBeDefined();
    }
    execFileSync(process.execPath, ['scripts/package.mjs']);
    expect(readFileSync('artifacts/modern-chimera-d20.zip')).toEqual(first);
  } finally {
    unlinkSync(unexpected);
    unlinkSync(nestedUnexpected);
  }
});
