import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { CoverPicker } from '../components/catalog/CoverPicker';
import { PageHeader } from '../components/layout/PageHeader';
import { Button, buttonVariants } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import { api, getApiErrorMessage } from '../lib/api';
import type { CatalogArtist, CatalogSong } from '../lib/catalog';
import { cn } from '../lib/utils';
import {
  createSongFormSchema,
  type CreateSongFormValues,
} from '../lib/validation/catalog';

export function NewSongPage() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<CatalogArtist[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(true);
  const [artistsError, setArtistsError] = useState<string | null>(null);
  const [artistQuery, setArtistQuery] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSongFormValues>({
    resolver: zodResolver(createSongFormSchema),
    defaultValues: {
      name: '',
      releaseDate: '',
      album: '',
      coverUrl: '',
      artistIds: [],
    },
  });

  const selectedIds = watch('artistIds');

  useEffect(() => {
    let cancelled = false;

    async function loadArtists() {
      setArtistsLoading(true);
      setArtistsError(null);
      try {
        const res = await api.get<{ artists: CatalogArtist[] }>('/artists', {
          params: { sortBy: 'name', sortOrder: 'asc' },
        });
        if (!cancelled) {
          setArtists(res.data.artists);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setArtistsError(getApiErrorMessage(error, 'Could not load artists'));
        }
      } finally {
        if (!cancelled) {
          setArtistsLoading(false);
        }
      }
    }

    void loadArtists();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredArtists = useMemo(() => {
    const q = artistQuery.trim().toLowerCase();
    if (!q) {
      return artists;
    }
    return artists.filter((artist) => artist.name.toLowerCase().includes(q));
  }, [artists, artistQuery]);

  function toggleArtist(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    setValue('artistIds', next, { shouldValidate: true });
  }

  async function onSubmit(values: CreateSongFormValues) {
    try {
      const album = values.album.trim();
      const coverUrl = values.coverUrl.trim();
      const res = await api.post<{ song: CatalogSong }>('/songs', {
        name: values.name,
        releaseDate: values.releaseDate,
        album: album === '' ? undefined : album,
        coverUrl: coverUrl === '' ? undefined : coverUrl,
        artistIds: values.artistIds,
      });
      toast.success('Song created');
      void navigate(`/songs/${res.data.song.id}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Could not create song'));
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/songs"
          className="w-fit text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to songs
        </Link>
        <PageHeader
          title="New song"
          subtitle="Add a catalog entry with artists and an optional cover."
        />
      </div>

      <form
        className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        noValidate
      >
        <Controller
          name="coverUrl"
          control={control}
          render={({ field }) => (
            <CoverPicker
              value={field.value.trim() === '' ? undefined : field.value}
              disabled={isSubmitting}
              onChange={(url) => {
                field.onChange(url ?? '');
              }}
            />
          )}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="song-name">Name</Label>
            <Input
              id="song-name"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="song-release">Release date</Label>
              <Input
                id="song-release"
                type="date"
                aria-invalid={Boolean(errors.releaseDate)}
                {...register('releaseDate')}
              />
              {errors.releaseDate ? (
                <p className="text-sm text-[var(--cadence-destructive)]">
                  {errors.releaseDate.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="song-album">Album (optional)</Label>
              <Input id="song-album" {...register('album')} />
              {errors.album ? (
                <p className="text-sm text-[var(--cadence-destructive)]">
                  {errors.album.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Artists</Label>
              <Link
                to="/artists/new?from=/songs/new"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                )}
              >
                New artist
              </Link>
            </div>

            <Input
              type="search"
              value={artistQuery}
              placeholder="Filter artists..."
              onChange={(event) => {
                setArtistQuery(event.target.value);
              }}
            />

            {artistsLoading ? (
              <div className="space-y-2 rounded-[var(--cadence-radius)] border border-[var(--cadence-border)] p-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-5 w-36" />
              </div>
            ) : null}

            {artistsError ? (
              <p
                className="text-sm text-[var(--cadence-fg-muted)]"
                role="alert"
              >
                {artistsError}
              </p>
            ) : null}

            {!artistsLoading && !artistsError ? (
              <div className="max-h-56 overflow-y-auto rounded-[var(--cadence-radius)] border border-[var(--cadence-border)] p-2">
                {filteredArtists.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-[var(--cadence-fg-muted)]">
                    No artists match. Add one above.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {filteredArtists.map((artist) => {
                      const checked = selectedIds.includes(artist.id);
                      return (
                        <li key={artist.id}>
                          <label className="flex cursor-pointer items-center gap-2 rounded-[calc(var(--cadence-radius)-2px)] px-2 py-1.5 text-sm hover:bg-[var(--cadence-muted)]/55">
                            <input
                              type="checkbox"
                              className="size-4 accent-[var(--cadence-accent)]"
                              checked={checked}
                              onChange={() => {
                                toggleArtist(artist.id);
                              }}
                            />
                            <span className="min-w-0 truncate">
                              {artist.name}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : null}

            {errors.artistIds ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.artistIds.message}
              </p>
            ) : null}
            {errors.coverUrl ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.coverUrl.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting || artistsLoading}>
              {isSubmitting ? 'Creating...' : 'Create song'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                void navigate('/songs');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
