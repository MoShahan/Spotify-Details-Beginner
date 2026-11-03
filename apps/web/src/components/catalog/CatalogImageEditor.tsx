import { ImagePlus, Pencil } from 'lucide-react';
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

import { getApiErrorMessage } from '../../lib/api';
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
  const titleId = useId();
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
    if (busy) {
      return;
    }
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
      toast.error(getApiErrorMessage(error, `Could not update ${label}`));
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
      toast.error(getApiErrorMessage(error, `Could not upload ${label}`));
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <>
      <div className="cadence-panel group relative aspect-square overflow-hidden">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={alt}
            className="cadence-cover-settle size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-[var(--cadence-fg-muted)]">
            {emptyLabel}
          </div>
        )}

        <div className="absolute top-1.5 right-1.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label="Edit image"
            className="group/edit h-7 gap-0 px-1.5 text-xs opacity-35 shadow-[var(--cadence-shadow)] transition-all duration-150 group-hover:gap-1 group-hover:px-2 group-hover:opacity-100 focus-visible:gap-1 focus-visible:px-2 focus-visible:opacity-100"
            onClick={openEditor}
          >
            <Pencil className="size-3 shrink-0" aria-hidden />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-150 group-hover:max-w-12 group-hover:opacity-100 group-focus-visible/edit:max-w-12 group-focus-visible/edit:opacity-100">
              Edit
            </span>
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close dialog"
            disabled={busy}
            onClick={closeEditor}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="cadence-panel relative z-10 w-full max-w-md p-5"
          >
            <h2
              id={titleId}
              className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight"
            >
              {label} URL
            </h2>
            <p className="mt-1 text-sm text-[var(--cadence-fg-muted)]">
              Paste an image URL, or upload a file to ImageKit.
            </p>

            <form
              className="mt-5 flex flex-col gap-4"
              onSubmit={(event) => {
                void handleSaveUrl(event);
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={urlInputId}>Image URL</Label>
                <Input
                  id={urlInputId}
                  type="url"
                  value={urlDraft}
                  placeholder="https://..."
                  disabled={busy}
                  autoFocus
                  onChange={(event) => {
                    setUrlDraft(event.target.value);
                  }}
                />
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

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onClick={closeEditor}
                >
                  Cancel
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
                <Button type="submit" size="sm" disabled={busy}>
                  {busy ? 'Saving...' : 'Save URL'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
