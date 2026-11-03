import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    // Shared TiDB - avoid parallel suites deleting each other's test users
    fileParallelism: false,
    // Remote MySQL / TiDB round-trips can exceed Vitest defaults
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
});
