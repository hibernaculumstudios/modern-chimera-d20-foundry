import { mkdir } from 'node:fs/promises';

// Pre-create nested mount parents on the host so Docker does not create root-owned directories.
await mkdir('.local/data/Data/systems', { recursive: true });
console.log(
  'Prepared ignored local data directories. Supply .local/config.json before starting Foundry.',
);
