import path from 'node:path';

export function validateManifest(manifest, version) {
  if (manifest.id !== 'modern-chimera-d20') throw new Error('Unexpected system ID.');
  if (manifest.version !== version) throw new Error('Package and manifest versions differ.');
  if (!/^\d+\.\d+\.\d+(?:-[\da-z.-]+)?$/i.test(version)) throw new Error('Invalid version.');
  if (manifest.compatibility?.minimum !== '14.366' || manifest.compatibility?.maximum !== '14') {
    throw new Error('Review the compatibility contract before changing the Foundry target.');
  }
  const paths = [
    ...(manifest.esmodules ?? []),
    ...(manifest.styles ?? []),
    ...(manifest.languages ?? []).map((language) => language.path),
    manifest.license,
    manifest.readme,
  ];
  if (!manifest.esmodules?.length) throw new Error('A system entry point is required.');
  for (const entry of paths) {
    if (
      typeof entry !== 'string' ||
      !entry ||
      entry.includes('\\') ||
      entry.includes(':') ||
      path.posix.isAbsolute(entry) ||
      entry.split('/').some((part) => !part || part === '..' || part === '.')
    ) {
      throw new Error('Manifest asset paths must be safe relative paths.');
    }
  }
  return paths;
}
