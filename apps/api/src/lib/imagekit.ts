import ImageKit from '@imagekit/nodejs';

export type ImageKitAuthPayload = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
  folder: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function getImageKitFolderRoot(): string {
  const raw = process.env.IMAGEKIT_FOLDER?.trim() || '/cadence';
  return raw.startsWith('/') ? raw : `/${raw}`;
}

export function buildImageKitUploadFolder(kind: 'songs' | 'artists'): string {
  return `${getImageKitFolderRoot()}/${kind}`;
}

export function createImageKitAuth(
  kind: 'songs' | 'artists',
): ImageKitAuthPayload {
  const privateKey = requireEnv('IMAGEKIT_PRIVATE_KEY');
  const publicKey = requireEnv('IMAGEKIT_PUBLIC_KEY');
  const urlEndpoint = requireEnv('IMAGEKIT_URL_ENDPOINT');

  const client = new ImageKit({ privateKey });
  const auth = client.helper.getAuthenticationParameters();

  return {
    token: auth.token,
    expire: auth.expire,
    signature: auth.signature,
    publicKey,
    urlEndpoint,
    folder: buildImageKitUploadFolder(kind),
  };
}
