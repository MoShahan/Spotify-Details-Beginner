import { useState } from 'react';
import { toast } from 'sonner';

import { api, getApiErrorMessage } from '../../lib/api';

const RATING_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const;

type SongRatingControlProps = {
  songId: string;
  initialValue?: number | null;
  onRated?: (value: number) => void;
  onCancel?: () => void;
  showCancel?: boolean;
};

export function SongRatingControl({
  songId,
  initialValue = null,
  onRated,
  onCancel,
  showCancel = false,
}: SongRatingControlProps) {
  const [value, setValue] = useState(
    initialValue === null ? '' : String(initialValue),
  );
  const [busy, setBusy] = useState(false);

  async function handleChange(next: string) {
    if (!next) {
      setValue(initialValue === null ? '' : String(initialValue));
      return;
    }

    const numeric = Number(next);
    setValue(next);
    setBusy(true);
    try {
      await api.post(`/songs/${songId}/ratings`, { value: numeric });
      toast.success('Rating saved');
      onRated?.(numeric);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Could not save rating'));
      setValue(initialValue === null ? '' : String(initialValue));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex flex-col gap-0.5">
        <span className="sr-only">Rate song</span>
        <select
          className="cadence-field h-9 px-2 text-sm text-[var(--cadence-fg)] focus-visible:outline-none disabled:opacity-50"
          value={value}
          disabled={busy}
          aria-label="Rate from 1 to 5"
          onChange={(event) => {
            void handleChange(event.target.value);
          }}
        >
          <option value="">
            {busy
              ? 'Saving...'
              : initialValue === null
                ? 'Select rating'
                : 'Change rating'}
          </option>
          {RATING_OPTIONS.map((option) => (
            <option key={option} value={String(option)}>
              {option.toFixed(1)}
            </option>
          ))}
        </select>
      </label>
      {showCancel && onCancel ? (
        <button
          type="button"
          className="text-sm text-[var(--cadence-fg-muted)] underline-offset-4 hover:underline disabled:opacity-50"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
      ) : null}
    </div>
  );
}
