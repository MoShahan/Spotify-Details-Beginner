import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ImageUrlFormProps = {
  label: string;
  currentUrl: string | null;
  onSave: (url: string | null) => Promise<void>;
};

export function ImageUrlForm({ label, currentUrl, onSave }: ImageUrlFormProps) {
  const [url, setUrl] = useState(currentUrl ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const next = url.trim() === '' ? null : url.trim();
      await onSave(next);
      toast.success(`${label} updated`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Could not update ${label}`;
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image-url">{label} URL</Label>
        <Input
          id="image-url"
          type="url"
          value={url}
          placeholder="https://..."
          onChange={(event) => {
            setUrl(event.target.value);
          }}
        />
        <p className="text-xs text-[var(--cadence-fg-muted)]">
          Paste an image URL for now. ImageKit upload comes later.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saving} size="sm">
          {saving ? 'Saving...' : 'Save image'}
        </Button>
        {currentUrl ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={() => {
              setUrl('');
              void (async () => {
                setSaving(true);
                try {
                  await onSave(null);
                  toast.success(`${label} cleared`);
                } catch (error: unknown) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : `Could not clear ${label}`;
                  toast.error(message);
                } finally {
                  setSaving(false);
                }
              })();
            }}
          >
            Remove
          </Button>
        ) : null}
      </div>
    </form>
  );
}
