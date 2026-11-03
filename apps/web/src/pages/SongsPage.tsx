import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { SongCatalogTable } from '../components/catalog/SongCatalogTable';
import { PageHeader } from '../components/layout/PageHeader';
import { buttonVariants } from '../components/ui/button';
import { useInfiniteCatalogQuery } from '../hooks/useInfiniteCatalogQuery';
import { api } from '../lib/api';
import {
  CATALOG_PAGE_SIZE,
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

  const state = useInfiniteCatalogQuery({
    deps: [search, sortBy, sortOrder],
    errorMessage: 'Could not load songs',
    loadPage: async (offset) => {
      const res = await api.get<{ songs: CatalogSong[]; hasMore: boolean }>(
        '/songs',
        {
          params: {
            q: search.trim() || undefined,
            sortBy,
            sortOrder,
            limit: CATALOG_PAGE_SIZE,
            offset,
          },
        },
      );
      return { items: res.data.songs, hasMore: res.data.hasMore };
    },
  });

  function handleSort(column: SongSortBy) {
    const next = nextSortState(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Songs"
        subtitle="Browse the catalog. Search, then click a column header to sort."
        actions={
          <Link to="/songs/new" className={cn(buttonVariants())}>
            <Plus className="size-4" aria-hidden />
            New song
          </Link>
        }
      />

      <CatalogSearch
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, artist, album, year..."
      />

      <SongCatalogTable
        songs={state.items}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        status={state.status}
        errorMessage={state.message}
        hasMore={state.hasMore}
        sentinelRef={state.sentinelRef}
      />
    </section>
  );
}
