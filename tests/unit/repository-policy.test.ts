import { describe, expect, it } from 'vitest';
import { checkIdentity, checkPath, checkText } from '../../scripts/repository-policy.mjs';

describe('repository hygiene', () => {
  it.each([
    '.claude/settings.json',
    'nested/.codex/session.json',
    'AGENTS.md',
    '.local/config.json',
    '.env',
    '.env.test',
  ])('rejects local path %s', (path) => {
    expect(() => checkPath(path)).toThrow();
  });
  it.each(['src/main.ts', '.env.example', 'docs/architecture.md', '.gitignore'])(
    'accepts public source path %s',
    (path) => {
      expect(() => checkPath(path)).not.toThrow();
    },
  );
  it('rejects assistant trailers but allows human coauthors', () => {
    const trailer = 'Co-authored-by: ';
    expect(() => checkText(trailer + 'Codex <bot@example.invalid>', 'message')).toThrow();
    expect(() =>
      checkText(trailer + 'A Contributor <human@example.invalid>', 'message'),
    ).not.toThrow();
  });
  it('rejects assistant author identity', () => {
    expect(() => checkIdentity('Claude <bot@example.invalid>')).toThrow();
  });
  it('allows discussion of tools without attribution', () => {
    expect(() => checkText('Local Codex settings stay untracked.', 'policy')).not.toThrow();
  });
});
