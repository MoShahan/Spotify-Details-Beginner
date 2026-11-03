import { describe, expect, it } from 'vitest';

import { createMariaDbAdapterFromUrl } from './mariadb-adapter.js';

describe('createMariaDbAdapterFromUrl', () => {
  it('builds an adapter for a local MySQL URL without SSL', () => {
    const adapter = createMariaDbAdapterFromUrl(
      'mysql://root:root@127.0.0.1:3306/cadence',
    );
    expect(adapter).toBeTruthy();
  });

  it('builds an adapter for a TiDB-style URL with strict SSL', () => {
    const adapter = createMariaDbAdapterFromUrl(
      'mysql://user:pass@gateway.example:4000/cadence?sslaccept=strict',
    );
    expect(adapter).toBeTruthy();
  });
});
