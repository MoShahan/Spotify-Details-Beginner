import { spawnSync } from 'node:child_process';

/** Skip git hooks setup on hosts that omit husky (e.g. Render production install). */
if (process.env.HUSKY === '0' || process.env.CI === 'true') {
  process.exit(0);
}

const result = spawnSync('husky', {
  stdio: 'inherit',
  shell: true,
});

if (result.error || (result.status !== 0 && result.status !== null)) {
  process.exit(0);
}
