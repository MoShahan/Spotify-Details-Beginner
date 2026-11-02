import { ImagePlus, Pencil, X } from 'lucide-react';
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

import {
  type ImageKitFolderKind,
  uploadImageToImageKit,
} from '../../lib/imagekit-upload';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type CatalogImageEditorProps = {
  label: string;
  alt: string;
  emptyLabel: string;
  currentUrl: string | null;
  folder: ImageKitFolderKind;
  onSave: (url: string | null) => Promise<void>;
};

export function CatalogImageEditor({
  label,
  alt,
  emptyLabel,
  currentUrl,
  folder,
  onSave,
}: CatalogImageEditorProps) {
  const urlInputId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [urlDraft, setUrlDraft] = useState(currentUrl ?? '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) {
      setUrlDraft(currentUrl ?? '');
    }
  }, [currentUrl, editing]);

  function openEditor() {
    setUrlDraft(currentUrl ?? '');
    setEditing(true);
  }

  function closeEditor() {
    setEditing(false);
    setUrlDraft(currentUrl ?? '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function saveUrl(next: string | null, successMessage: string) {
    setBusy(true);
    try {
      await onSave(next);
      toast.success(successMessage);
      setEditing(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Could not update ${label}`;
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveUrl(event: FormEvent) {
    event.preventDefault();
    const next = urlDraft.trim() === '' ? null : urlDraft.trim();
    await saveUrl(next, `${label} updated`);
  }

  async function handleRemove() {
    setUrlDraft('');
    await saveUrl(null, `${label} cleared`);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setBusy(true);
    try {
      const uploadedUrl = await uploadImageToImageKit(file, folder);
      setUrlDraft(uploadedUrl);
      await onSave(uploadedUrl);
      toast.success(`${label} uploaded`);
      setEditing(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Could not upload ${label}`;
      toast.error(message);
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="cadence-panel relative aspect-square overflow-hidden">
        {currentUrl ? (
          <img src={currentUrl} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-[var(--cadence-fg-muted)]">
            {emptyLabel}
          </div>
        )}

        <div className="absolute top-2 right-2">
          {editing ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5 shadow-[var(--cadence-shadow)]"
              disabled={busy}
              onClick={closeEditor}
            >
              <X className="size-3.5" aria-hidden />
              Cancel
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1.5 shadow-[var(--cadence-shadow)]"
              onClick={openEditor}
            >
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </Button>
          )}
        </div>
      </div>

      {!editing && currentUrl ? (
        <p
          className="truncate text-xs text-[var(--cadence-fg-muted)]"
          title={currentUrl}
        >
          {currentUrl}
        </p>
      ) : null}

      {editing ? (
        <form
          className="cadence-panel flex flex-col gap-3 p-3"
          onSubmit={(event) => {
            void handleSaveUrl(event);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={urlInputId}>{label} URL</Label>
            <Input
              id={urlInputId}
              type="url"
              value={urlDraft}
              placeholder="https://..."
              disabled={busy}
              onChange={(event) => {
                setUrlDraft(event.target.value);
              }}
            />
            <p className="text-xs text-[var(--cadence-fg-muted)]">
              Paste an image URL, or upload a file to ImageKit.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={busy}
              onChange={(event) => {
                void handleFileChange(event);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              disabled={busy}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <ImagePlus className="size-4" aria-hidden />
              {busy ? 'Working...' : 'Upload from computer'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? 'Saving...' : 'Save URL'}
            </Button>
            {currentUrl ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={busy}
                onClick={() => {
                  void handleRemove();
                }}
              >
                Remove
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
