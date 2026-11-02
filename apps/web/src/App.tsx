import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { api } from './lib/api';

function HomePage() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'down'>(
    'loading',
  );

  useEffect(() => {
    let cancelled = false;

    api
      .get<{ status: string }>('/health')
      .then((res) => {
        if (!cancelled) {
          setApiStatus(res.data.status === 'ok' ? 'ok' : 'down');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiStatus('down');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-neutral-600">
        Music catalog
      </p>
      <h1 className="text-5xl font-semibold tracking-tight text-[var(--cadence-ink)] sm:text-6xl">
        Cadence
      </h1>
      <p className="max-w-xl text-lg text-neutral-700">
        Rate the rhythm. Rank the artists. Phase 0 scaffold is live - Vite +
        React + TypeScript on the web, Express + Prisma on the API.
      </p>
      <p className="text-sm text-neutral-600">
        API:{' '}
        {apiStatus === 'loading'
          ? 'checking…'
          : apiStatus === 'ok'
            ? 'connected'
            : 'offline (start cadence-api)'}
      </p>
      <Link className="text-sm underline underline-offset-4" to="/">
        Home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
