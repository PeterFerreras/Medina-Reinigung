const { execFileSync } = require('node:child_process');

execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.seed.json'], {
  stdio: 'inherit',
});

execFileSync(process.execPath, ['.prisma-seed/prisma/seed.js'], {
  stdio: 'inherit',
});
