import { Link } from 'react-router-dom';

import {
  type CatalogSong,
  formatRating,
  type SongSortBy,
  type SortOrder,
} from '../../lib/catalog';
import { ArtistLinkList } from './ArtistLinkList';
import { CatalogThumb } from './CatalogThumb';
import { SortableTh } from './SortableTh';
import { TableBodySkeleton } from './TableBodySkeleton';

type SongCatalogTableProps = {
  songs: CatalogSong[];
  sortBy: SongSortBy;
  sortOrder: SortOrder;
  onSort: (column: SongSortBy) => void;
  status?: 'loading' | 'loadingMore' | 'error' | 'ready';
  errorMessage?: string;
  emptyMessage?: string;
  hasMore?: boolean;
  sentinelRef?: (node: Element | null) => void;
};

export function SongCatalogTable({
  songs,
  sortBy,
  sortOrder,
  onSort,
  status = 'ready',
  errorMessage,
  emptyMessage = 'No songs match your search.',
  hasMore = false,
  sentinelRef,
}: SongCatalogTableProps) {
  const showRows = status === 'ready' || status === 'loadingMore';

  return (
    <div className="cadence-panel overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        <thead className="bg-[var(--cadence-muted)]/45">
          <tr>
            <th
              scope="col"
              className="w-16 border-b border-[var(--cadence-border)] px-3 py-3 text-left text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)]"
            >
              <span className="sr-only">Cover</span>
            </th>
            <SortableTh
              label="Name"
              column="name"
              activeColumn={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th
              scope="col"
              className="border-b border-[var(--cadence-border)] px-3 py-3 text-left text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)]"
            >
              Artists
            </th>
            <SortableTh
              label="Album"
              column="album"
              activeColumn={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTh
              label="Year"
              column="releaseYear"
              activeColumn={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <SortableTh
              label="Rating"
              column="rating"
              activeColumn={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
              align="right"
            />
          </tr>
        </thead>
        <tbody>
          {status === 'loading' ? <TableBodySkeleton columns={6} /> : null}

          {status === 'error' ? (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
                role="alert"
              >
                {errorMessage}
              </td>
            </tr>
          ) : null}

          {showRows && songs.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : null}

          {showRows
            ? songs.map((song) => (
                <tr
                  key={song.id}
                  className="transition-colors odd:bg-transparent even:bg-[var(--cadence-muted)]/20 hover:bg-[var(--cadence-muted)]/45"
                >
                  <td className="border-b border-[var(--cadence-border)] px-3 py-2.5">
                    <Link to={`/songs/${song.id}`} tabIndex={-1}>
                      <CatalogThumb
                        src={song.coverUrl}
                        alt={`${song.name} cover`}
                        size="sm"
                      />
                    </Link>
                  </td>
                  <td className="border-b border-[var(--cadence-border)] px-3 py-3 font-medium text-[var(--cadence-fg)]">
                    <Link
                      to={`/songs/${song.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {song.name}
                    </Link>
                  </td>
                  <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-[var(--cadence-fg-muted)]">
                    <ArtistLinkList artists={song.artists} />
                  </td>
                  <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-[var(--cadence-fg-muted)]">
                    {song.album ?? '-'}
                  </td>
                  <td className="border-b border-[var(--cadence-border)] px-3 py-3 tabular-nums text-[var(--cadence-fg-muted)]">
                    {song.releaseYear}
                  </td>
                  <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-right font-medium tabular-nums text-[var(--cadence-fg)]">
                    {formatRating(song.averageRating)}
                  </td>
                </tr>
              ))
            : null}

          {status === 'loadingMore' ? (
            <TableBodySkeleton columns={6} rows={3} />
          ) : null}

          {showRows && hasMore ? (
            <tr ref={sentinelRef} aria-hidden="true">
              <td colSpan={6} className="h-1 p-0" />
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
