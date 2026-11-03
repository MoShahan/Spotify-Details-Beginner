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

/** Song detail includes the signed-in user's rating when present. */
export type SongDetail = CatalogSong & {
  myRating: number | null;
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

export type ArtistDetailSong = CatalogSong;

export type ArtistDetail = CatalogArtist & {
  songs: ArtistDetailSong[];
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
