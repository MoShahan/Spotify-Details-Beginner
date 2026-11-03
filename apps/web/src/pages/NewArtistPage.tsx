import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { CoverPicker } from '../components/catalog/CoverPicker';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { api, getApiErrorMessage } from '../lib/api';
import type { CatalogArtist } from '../lib/catalog';
import {
  createArtistFormSchema,
  type CreateArtistFormValues,
} from '../lib/validation/catalog';

export function NewArtistPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('from');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtistFormValues>({
    resolver: zodResolver(createArtistFormSchema),
    defaultValues: { name: '', dob: '', bio: '', imageUrl: '' },
  });

  async function onSubmit(values: CreateArtistFormValues) {
    try {
      const dob = values.dob.trim();
      const bio = values.bio.trim();
      const imageUrl = values.imageUrl.trim();
      const res = await api.post<{ artist: CatalogArtist }>('/artists', {
        name: values.name,
        dob: dob === '' ? undefined : dob,
        bio: bio === '' ? undefined : bio,
        imageUrl: imageUrl === '' ? undefined : imageUrl,
      });
      toast.success('Artist created');
      if (returnTo === '/songs/new') {
        void navigate('/songs/new');
        return;
      }
      void navigate(`/artists/${res.data.artist.id}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Could not create artist'));
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/artists"
          className="w-fit text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to artists
        </Link>
        <PageHeader
          title="New artist"
          subtitle="Add an artist with an optional image."
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
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <CoverPicker
              value={field.value.trim() === '' ? undefined : field.value}
              disabled={isSubmitting}
              folder="artists"
              label="Image URL (optional)"
              emptyLabel="No image"
              previewAlt="Artist image preview"
              onChange={(url) => {
                field.onChange(url ?? '');
              }}
            />
          )}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="artist-name">Name</Label>
            <Input
              id="artist-name"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="artist-dob">Date of birth (optional)</Label>
            <Input
              id="artist-dob"
              type="date"
              aria-invalid={Boolean(errors.dob)}
              {...register('dob')}
            />
            {errors.dob ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.dob.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="artist-bio">Bio (optional)</Label>
            <textarea
              id="artist-bio"
              rows={4}
              className="cadence-field w-full px-3 py-2 text-sm text-[var(--cadence-fg)] placeholder:text-[var(--cadence-fg-muted)] focus-visible:outline-none disabled:opacity-50"
              aria-invalid={Boolean(errors.bio)}
              {...register('bio')}
            />
            {errors.bio ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.bio.message}
              </p>
            ) : null}
          </div>

          {errors.imageUrl ? (
            <p className="text-sm text-[var(--cadence-destructive)]">
              {errors.imageUrl.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create artist'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => {
                void navigate(
                  returnTo === '/songs/new' ? '/songs/new' : '/artists',
                );
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
