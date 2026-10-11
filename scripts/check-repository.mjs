import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { checkIdentity, checkPath, checkText } from './repository-policy.mjs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const messageIndex = process.argv.indexOf('--commit-message');
if (messageIndex !== -1) {
  checkText(readFileSync(process.argv[messageIndex + 1], 'utf8'), 'commit message');
  checkIdentity(git('var', 'GIT_AUTHOR_IDENT'));
  checkIdentity(git('var', 'GIT_COMMITTER_IDENT'));
} else {
  const staged = process.argv.includes('--staged');
  const files = git('ls-files', '-z').split('\0').filter(Boolean);
  for (const file of files) {
    checkPath(file);
    const content = staged ? git('show', `:${file}`) : readFileSync(file, 'utf8');
    checkText(content, file);
  }
  // Every available commit, not just HEAD, including author and committer identity.
  const count = git('rev-list', '--all', '--count').trim();
  if (Number(count) > 0) {
    const records = git('log', '--all', '--format=%an <%ae>%n%cn <%ce>%x00%B%x00').split('\0');
    for (let i = 0; i + 1 < records.length; i += 2) {
      checkIdentity(records[i]);
      checkText(records[i + 1], 'commit history');
    }
  }
  console.log(`Repository policy passed for ${files.length} tracked files and ${count} commits.`);
}
