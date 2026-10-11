import { build, context } from 'esbuild';
import { cp, mkdir, readFile } from 'node:fs/promises';
import { validateManifest } from './manifest.mjs';

const manifest = JSON.parse(await readFile('system.json', 'utf8'));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
validateManifest(manifest, pkg.version);
await mkdir('dist', { recursive: true });
// Copy only published assets. Never copy the repository or local runtime wholesale.
for (const entry of ['system.json', 'templates', 'styles', 'lang', 'LICENSE', 'README.md']) {
  await cp(entry, `dist/${entry}`, { recursive: true });
}
const options = {
  entryPoints: ['src/main.ts'],
  outfile: 'dist/modern-chimera-d20.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  sourcemap: false,
  logLevel: 'info',
};
if (process.argv.includes('--watch')) {
  const ctx = await context(options);
  await ctx.watch();
  console.log(
    'Watching TypeScript. Re-run build after template, style, language, or manifest changes.',
  );
} else {
  await build(options);
}
