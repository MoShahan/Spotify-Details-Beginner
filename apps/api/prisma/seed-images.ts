/**
 * Resolve catalog images and optionally host them on ImageKit.
 * Artists: Deezer portraits (fallback iTunes). Songs: iTunes artwork.
 * Missing matches or upload failures return null - seed still succeeds.
 */
import ImageKit from '@imagekit/nodejs';

const IMAGEKIT_FOLDER = process.env.IMAGEKIT_FOLDER?.trim() || '/cadence';

type DeezerArtistHit = {
  name?: string;
  picture_xl?: string;
  picture_medium?: string;
};

type DeezerSearchResponse<T> = {
  data?: T[];
};

type ItunesSongHit = {
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
};

type ItunesSearchResponse<T> = {
  resultCount?: number;
  results?: T[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function enlargeItunesArtwork(url: string): string {
  return url.replace(/\/\d+x\d+([a-z]*)\.([a-z]+)$/i, '/1000x1000$1.$2');
}

function createImageKitClient(): ImageKit | null {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  if (!privateKey) {
    return null;
  }

  return new ImageKit({ privateKey });
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function lookupDeezerArtistImageUrl(
  artistName: string,
): Promise<string | null> {
  const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=5`;
  const json = await fetchJson<DeezerSearchResponse<DeezerArtistHit>>(url);
  const hits = json?.data ?? [];
  const exact = hits.find(
    (hit) => hit.name?.toLowerCase() === artistName.toLowerCase(),
  );
  const pick = exact ?? hits[0];
  return pick?.picture_xl ?? pick?.picture_medium ?? null;
}

async function lookupItunesArtistSongArtwork(
  artistName: string,
): Promise<string | null> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=5`;
  const json = await fetchJson<ItunesSearchResponse<ItunesSongHit>>(url);
  const hits = json?.results ?? [];
  const preferred =
    hits.find(
      (hit) => hit.artistName?.toLowerCase() === artistName.toLowerCase(),
    ) ?? hits[0];
  return preferred?.artworkUrl100
    ? enlargeItunesArtwork(preferred.artworkUrl100)
    : null;
}

export async function lookupArtistImageUrl(
  artistName: string,
): Promise<string | null> {
  return (
    (await lookupDeezerArtistImageUrl(artistName)) ??
    (await lookupItunesArtistSongArtwork(artistName))
  );
}

export async function lookupSongCoverUrl(input: {
  songName: string;
  album: string | null;
  artistNames: string[];
}): Promise<string | null> {
  const primaryArtist = input.artistNames[0] ?? '';
  const queries = [
    `${input.songName} ${primaryArtist}`.trim(),
    input.album
      ? `${input.album} ${primaryArtist}`.trim()
      : `${input.songName}`.trim(),
  ];

  for (const query of queries) {
    if (!query) {
      continue;
    }
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=8`;
    const json = await fetchJson<ItunesSearchResponse<ItunesSongHit>>(url);
    const hits = json?.results ?? [];
    if (hits.length === 0) {
      continue;
    }

    const songLower = input.songName.toLowerCase();
    const preferred =
      hits.find((hit) => {
        const title = hit.trackName?.toLowerCase() ?? '';
        const artistOk =
          !primaryArtist ||
          hit.artistName?.toLowerCase() === primaryArtist.toLowerCase();
        return (
          artistOk &&
          (title === songLower ||
            title.includes(songLower.slice(0, Math.min(12, songLower.length))))
        );
      }) ??
      hits.find(
        (hit) =>
          !primaryArtist ||
          hit.artistName?.toLowerCase() === primaryArtist.toLowerCase(),
      ) ??
      hits[0];

    if (preferred?.artworkUrl100) {
      return enlargeItunesArtwork(preferred.artworkUrl100);
    }
  }

  return null;
}

export async function hostOnImageKit(input: {
  sourceUrl: string;
  fileName: string;
  folder: string;
  client: ImageKit;
}): Promise<string | null> {
  try {
    const sourceRes = await fetch(input.sourceUrl);
    if (!sourceRes.ok) {
      console.warn(
        `Could not download ${input.fileName} (${sourceRes.status})`,
      );
      return null;
    }

    const uploaded = await input.client.files.upload({
      file: sourceRes,
      fileName: input.fileName,
      folder: input.folder,
      useUniqueFileName: false,
      overwriteFile: true,
    });
    return uploaded.url ?? null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`ImageKit upload failed for ${input.fileName}: ${message}`);
    return null;
  }
}

export type SeedImageKit = {
  client: ImageKit | null;
  folder: string;
};

export function getSeedImageKit(): SeedImageKit {
  return {
    client: createImageKitClient(),
    folder: IMAGEKIT_FOLDER.startsWith('/')
      ? IMAGEKIT_FOLDER
      : `/${IMAGEKIT_FOLDER}`,
  };
}

export async function resolveArtistImage(input: {
  artistName: string;
  imageKit: SeedImageKit;
}): Promise<string | null> {
  const source = await lookupArtistImageUrl(input.artistName);
  if (!source) {
    return null;
  }
  if (!input.imageKit.client) {
    return source;
  }
  const hosted = await hostOnImageKit({
    sourceUrl: source,
    fileName: `${slugify(input.artistName) || 'artist'}.jpg`,
    folder: `${input.imageKit.folder}/artists`,
    client: input.imageKit.client,
  });
  return hosted ?? source;
}

export async function resolveSongCover(input: {
  songName: string;
  album: string | null;
  artistNames: string[];
  imageKit: SeedImageKit;
}): Promise<string | null> {
  const source = await lookupSongCoverUrl(input);
  if (!source) {
    return null;
  }
  if (!input.imageKit.client) {
    return source;
  }
  const hosted = await hostOnImageKit({
    sourceUrl: source,
    fileName: `${slugify(input.songName) || 'song'}.jpg`,
    folder: `${input.imageKit.folder}/songs`,
    client: input.imageKit.client,
  });
  return hosted ?? source;
}
