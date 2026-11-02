export type SongArtistRef = {
  id: string;
  name: string;
};

export type TopSong = {
  id: string;
  name: string;
  releaseDate: string;
  coverUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
  artists: SongArtistRef[];
};

export type TopArtist = {
  id: string;
  name: string;
  dob: string | null;
  bio: string | null;
  averageRating: number | null;
  ratingCount: number;
};

export function formatRating(value: number | null): string {
  if (value === null) {
    return '-';
  }
  return value.toFixed(1);
}
