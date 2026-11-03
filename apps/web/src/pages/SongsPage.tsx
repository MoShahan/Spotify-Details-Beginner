import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { SongCatalogTable } from '../components/catalog/SongCatalogTable';
import { buttonVariants } from '../components/ui/button';
import { useDebouncedCatalogQuery } from '../hooks/useDebouncedCatalogQuery';
import { api } from '../lib/api';
import {
  type CatalogSong,
  type SongSortBy,
  type SortOrder,
} from '../lib/catalog';
import { nextSortState } from '../lib/sort';
import { cn } from '../lib/utils';

export function SongsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SongSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const state = useDebouncedCatalogQuery({
    deps: [search, sortBy, sortOrder],
    errorMessage: 'Could not load songs',
    load: async () => {
      const res = await api.get<{ songs: CatalogSong[] }>('/songs', {
        params: {
          q: search.trim() || undefined,
          sortBy,
          sortOrder,
        },
      });
      return res.data.songs;
    },
  });

  function handleSort(column: SongSortBy) {
    const next = nextSortState(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Songs
          </h1>
          <p className="text-sm text-[var(--cadence-fg-muted)]">
            Browse the catalog. Search, then click a column header to sort.
          </p>
        </div>
        <Link
          to="/songs/new"
          className={cn(buttonVariants(), 'shrink-0 self-start sm:self-auto')}
        >
          <Plus className="size-4" aria-hidden />
          New song
        </Link>
      </div>

      <CatalogSearch
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, artist, album, year..."
      />

      <SongCatalogTable
        songs={state.status === 'ready' ? state.data : []}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        status={state.status}
        errorMessage={state.status === 'error' ? state.message : undefined}
      />
    </section>
  );
}
