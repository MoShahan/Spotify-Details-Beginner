import { PrismaMariaDb } from '@prisma/adapter-mariadb';

/** Build a MariaDB adapter from DATABASE_URL. SSL only when `sslaccept` is set. */
export function createMariaDbAdapterFromUrl(databaseUrl: string) {
  const parsed = new URL(databaseUrl);
  const sslMode = parsed.searchParams.get('sslaccept');
  const ssl =
    sslMode === 'strict'
      ? { rejectUnauthorized: true }
      : sslMode
        ? { rejectUnauthorized: false }
        : undefined;

  return new PrismaMariaDb({
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || undefined,
    connectionLimit: 5,
    ...(ssl ? { ssl } : {}),
  });
}
