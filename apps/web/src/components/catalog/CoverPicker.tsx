import { ImagePlus } from 'lucide-react';
import { type ChangeEvent, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  type ImageKitFolderKind,
  uploadImageToImageKit,
} from '../../lib/imagekit-upload';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type CoverPickerProps = {
  value: string | undefined;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  folder?: ImageKitFolderKind;
  label?: string;
  emptyLabel?: string;
  previewAlt?: string;
};

export function CoverPicker({
  value,
  onChange,
  disabled,
  folder = 'songs',
  label = 'Cover URL',
  emptyLabel = 'No cover',
  previewAlt = 'Cover preview',
}: CoverPickerProps) {
  const urlId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageToImageKit(file, folder);
      onChange(url);
      toast.success('Image uploaded');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Could not upload image';
      toast.error(message);
    } finally {
      setUploading(false);
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  }

  const busy = disabled || uploading;

  return (
    <div className="flex flex-col gap-3">
      <div className="cadence-panel aspect-square max-w-[12rem] overflow-hidden">
        {value ? (
          <img
            src={value}
            alt={previewAlt}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-[var(--cadence-fg-muted)]">
            {emptyLabel}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={urlId}>{label}</Label>
        <Input
          id={urlId}
          type="url"
          value={value ?? ''}
          placeholder="https://..."
          disabled={busy}
          onChange={(event) => {
            const next = event.target.value.trim();
            onChange(next === '' ? undefined : next);
          }}
        />
      </div>

      <input
        ref={fileRef}
        id={fileId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={busy}
        onChange={(event) => {
          void handleFile(event);
        }}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={busy}
        onClick={() => {
          fileRef.current?.click();
        }}
      >
        <ImagePlus className="size-4" aria-hidden />
        {uploading ? 'Uploading...' : 'Upload from computer'}
      </Button>
    </div>
  );
}
