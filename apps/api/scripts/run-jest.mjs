import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const jestPkgPath = require.resolve('jest/package.json');
const jestBin = path.join(path.dirname(jestPkgPath), 'bin', 'jest.js');

const rawArgs = process.argv.slice(2);
const forwardedArgs = [];
let filename;

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];

  if (arg === '--filename') {
    filename = rawArgs[i + 1];
    i += 1;
    continue;
  }

  if (arg.startsWith('--filename=')) {
    filename = arg.slice('--filename='.length);
    continue;
  }

  forwardedArgs.push(arg);
}

if (filename) {
  forwardedArgs.push(`--testPathPatterns=${filename}`);
}

const result = spawnSync(process.execPath, [jestBin, ...forwardedArgs], {
  stdio: 'inherit',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
