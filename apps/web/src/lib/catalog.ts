export type SongArtistRef = {
  id: string;
  name: string;
};

export type CatalogSong = {
  id: string;
  name: string;
  releaseDate: string;
  releaseYear: number;
  album: string | null;
  coverUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
  artists: SongArtistRef[];
};

export type CatalogArtist = {
  id: string;
  name: string;
  dob: string | null;
  bio: string | null;
  imageUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
};

export type ArtistDetail = CatalogArtist & {
  songs: Array<{
    id: string;
    name: string;
    releaseDate: string;
    releaseYear: number;
    album: string | null;
    coverUrl: string | null;
    averageRating: number | null;
    ratingCount: number;
  }>;
};

export type TopSong = CatalogSong;
export type TopArtist = CatalogArtist;

export type SongSortBy = 'name' | 'rating' | 'releaseYear' | 'album';
export type ArtistSortBy = 'name' | 'rating' | 'dob';
export type SortOrder = 'asc' | 'desc';

export function formatRating(value: number | null): string {
  if (value === null) {
    return '-';
  }
  return value.toFixed(1);
}
