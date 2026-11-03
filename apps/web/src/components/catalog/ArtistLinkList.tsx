import { Link } from 'react-router-dom';

import type { SongArtistRef } from '../../lib/catalog';

type ArtistLinkListProps = {
  artists: SongArtistRef[];
  empty?: string;
  underline?: boolean;
};

export function ArtistLinkList({
  artists,
  empty = '-',
  underline = false,
}: ArtistLinkListProps) {
  if (artists.length === 0) {
    return <>{empty}</>;
  }

  const linkClass = underline
    ? 'underline underline-offset-4'
    : 'underline-offset-4 hover:underline';

  return (
    <>
      {artists.map((artist, index) => (
        <span key={artist.id}>
          {index > 0 ? ', ' : null}
          <Link to={`/artists/${artist.id}`} className={linkClass}>
            {artist.name}
          </Link>
        </span>
      ))}
    </>
  );
}
