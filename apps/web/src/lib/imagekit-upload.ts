import { api, getApiErrorMessage } from './api';

export type ImageKitFolderKind = 'songs' | 'artists';

type ImageKitAuthResponse = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
  folder: string;
};

type ImageKitUploadResponse = {
  url?: string;
  filePath?: string;
  name?: string;
};

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export async function uploadImageToImageKit(
  file: File,
  folder: ImageKitFolderKind,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Use a JPEG, PNG, WebP, or GIF image');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 8 MB or smaller');
  }

  let auth: ImageKitAuthResponse;
  try {
    const res = await api.post<ImageKitAuthResponse>('/uploads/imagekit-auth', {
      folder,
    });
    auth = res.data;
  } catch (error: unknown) {
    throw new Error(
      getApiErrorMessage(error, 'Could not start ImageKit upload'),
    );
  }

  const form = new FormData();
  form.append('file', file);
  form.append('fileName', file.name || `cadence-${Date.now()}.jpg`);
  form.append('publicKey', auth.publicKey);
  form.append('signature', auth.signature);
  form.append('expire', String(auth.expire));
  form.append('token', auth.token);
  form.append('folder', auth.folder);

  const uploadRes = await fetch(
    'https://upload.imagekit.io/api/v1/files/upload',
    {
      method: 'POST',
      body: form,
    },
  );

  const payload: unknown = await uploadRes.json().catch(() => null);
  if (!uploadRes.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof (payload as { message: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : 'ImageKit upload failed';
    throw new Error(message);
  }

  const uploaded = payload as ImageKitUploadResponse;
  if (!uploaded.url) {
    throw new Error('ImageKit did not return an image URL');
  }
  return uploaded.url;
}
