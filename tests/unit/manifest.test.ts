import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateManifest } from '../../scripts/manifest.mjs';

const manifest = JSON.parse(readFileSync('system.json', 'utf8'));
const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

describe('package contract', () => {
  it('accepts the development manifest and returns its required assets', () => {
    expect(validateManifest(manifest, version)).toContain('modern-chimera-d20.js');
  });
  it('rejects mismatched package versions', () => {
    expect(() => validateManifest(manifest, '9.9.9')).toThrow('versions differ');
  });
  it.each([
    '../secret',
    '/secret',
    'C:/secret',
    'templates\\secret',
    'https://host/file',
    'a/./b',
    'a//b',
  ])('rejects unsafe asset path %s', (asset) => {
    expect(() => validateManifest({ ...manifest, esmodules: [asset] }, version)).toThrow(
      'safe relative',
    );
  });
  it('rejects missing entry points', () => {
    expect(() => validateManifest({ ...manifest, esmodules: [] }, version)).toThrow('entry point');
  });
  it('rejects unreviewed compatibility changes', () => {
    expect(() =>
      validateManifest({ ...manifest, compatibility: { minimum: '13' } }, version),
    ).toThrow('compatibility');
  });
});
