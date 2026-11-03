import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { CatalogThumb } from '../components/catalog/CatalogThumb';
import { SortableTh } from '../components/catalog/SortableTh';
import { TableBodySkeleton } from '../components/catalog/TableBodySkeleton';
import { PageHeader } from '../components/layout/PageHeader';
import { buttonVariants } from '../components/ui/button';
import { useInfiniteCatalogQuery } from '../hooks/useInfiniteCatalogQuery';
import { api } from '../lib/api';
import {
  type ArtistSortBy,
  CATALOG_PAGE_SIZE,
  type CatalogArtist,
  formatRating,
  type SortOrder,
} from '../lib/catalog';
import { nextSortState } from '../lib/sort';
import { cn } from '../lib/utils';

export function ArtistsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<ArtistSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const state = useInfiniteCatalogQuery({
    deps: [search, sortBy, sortOrder],
    errorMessage: 'Could not load artists',
    loadPage: async (offset) => {
      const res = await api.get<{
        artists: CatalogArtist[];
        hasMore: boolean;
      }>('/artists', {
        params: {
          q: search.trim() || undefined,
          sortBy,
          sortOrder,
          limit: CATALOG_PAGE_SIZE,
          offset,
        },
      });
      return { items: res.data.artists, hasMore: res.data.hasMore };
    },
  });

  function handleSort(column: ArtistSortBy) {
    const next = nextSortState(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }

  const showRows = state.status === 'ready' || state.status === 'loadingMore';

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Artists"
        subtitle="Browse artists. Search, then click a column header to sort."
        actions={
          <Link to="/artists/new" className={cn(buttonVariants())}>
            <Plus className="size-4" aria-hidden />
            New artist
          </Link>
        }
      />

      <CatalogSearch
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name, bio, DOB..."
      />

      <div className="cadence-panel overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead className="bg-[var(--cadence-muted)]/45">
            <tr>
              <th
                scope="col"
                className="w-16 border-b border-[var(--cadence-border)] px-3 py-3 text-left text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)]"
              >
                <span className="sr-only">Image</span>
              </th>
              <SortableTh
                label="Name"
                column="name"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTh
                label="Date of birth"
                column="dob"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <th
                scope="col"
                className="border-b border-[var(--cadence-border)] px-3 py-3 text-right text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)]"
              >
                Ratings
              </th>
              <SortableTh
                label="Avg rating"
                column="rating"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
              />
            </tr>
          </thead>
          <tbody>
            {state.status === 'loading' ? (
              <TableBodySkeleton columns={5} />
            ) : null}

            {state.status === 'error' ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
                  role="alert"
                >
                  {state.message}
                </td>
              </tr>
            ) : null}

            {showRows && state.items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
                >
                  No artists match your search.
                </td>
              </tr>
            ) : null}

            {showRows
              ? state.items.map((artist) => (
                  <tr
                    key={artist.id}
                    className="transition-colors odd:bg-transparent even:bg-[var(--cadence-muted)]/20 hover:bg-[var(--cadence-muted)]/45"
                  >
                    <td className="border-b border-[var(--cadence-border)] px-3 py-2.5">
                      <Link to={`/artists/${artist.id}`} tabIndex={-1}>
                        <CatalogThumb
                          src={artist.imageUrl}
                          alt={artist.name}
                          size="sm"
                        />
                      </Link>
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 font-medium text-[var(--cadence-fg)]">
                      <Link
                        to={`/artists/${artist.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {artist.name}
                      </Link>
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 tabular-nums text-[var(--cadence-fg-muted)]">
                      {artist.dob ?? '-'}
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-right tabular-nums text-[var(--cadence-fg-muted)]">
                      {artist.ratingCount}
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-right font-medium tabular-nums text-[var(--cadence-fg)]">
                      {formatRating(artist.averageRating)}
                    </td>
                  </tr>
                ))
              : null}

            {state.status === 'loadingMore' ? (
              <TableBodySkeleton columns={5} rows={3} />
            ) : null}

            {showRows && state.hasMore ? (
              <tr ref={state.sentinelRef} aria-hidden="true">
                <td colSpan={5} className="h-1 p-0" />
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
