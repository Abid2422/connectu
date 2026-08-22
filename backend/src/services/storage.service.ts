import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { HttpError } from '../utils/httpError';
import { ALLOWED_PHOTO_MIME_TYPES } from '../middleware/upload.middleware';

export type PhotoKind = 'avatar' | 'photo';

let client: S3Client | undefined;

// R2_ENDPOINT overrides the endpoint entirely — used for the local MinIO
// substitute in docker-compose.yml. Real R2 derives its endpoint from the
// account id per Cloudflare's convention.
function getClient(): S3Client {
  if (client) return client;

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = process.env;

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !(R2_ENDPOINT || R2_ACCOUNT_ID)) {
    throw new HttpError(
      500,
      'Object storage is not configured. Set R2_ACCOUNT_ID (or R2_ENDPOINT), R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.',
    );
  }

  client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

function getBucket(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new HttpError(500, 'Object storage is not configured. Set R2_BUCKET_NAME.');
  }
  return bucket;
}

function getPublicBaseUrl(): string {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) {
    throw new HttpError(500, 'Object storage is not configured. Set R2_PUBLIC_URL.');
  }
  return base.replace(/\/+$/, '');
}

// Uploads a photo to a per-user, per-kind key and returns its public URL.
// Buckets are served publicly (no auth/signing) — see the photo upload
// review notes on why, and the tradeoff that a leaked URL is viewable by
// anyone. Keys use a random UUID so URLs aren't guessable in practice.
export async function uploadPhotoObject(
  userId: string,
  kind: PhotoKind,
  buffer: Buffer,
  mimetype: string,
): Promise<string> {
  const extension = ALLOWED_PHOTO_MIME_TYPES[mimetype];
  if (!extension) {
    throw new HttpError(400, 'Only JPEG, PNG, and WebP images are allowed.');
  }

  const key = `users/${userId}/${kind}-${crypto.randomUUID()}.${extension}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }),
  );

  return `${getPublicBaseUrl()}/${key}`;
}

// Best-effort delete of a previously-uploaded photo (e.g. when replacing
// the avatar or removing an additional photo). Failures are logged and
// swallowed rather than propagated — the DB update reflecting the user's
// intent already succeeded by the time this runs, and we'd rather leave an
// orphaned object in the bucket than fail the user-facing request over
// cleanup. Silently no-ops for a URL that isn't under our public base (e.g.
// already null, or predates this feature).
export async function deletePhotoObject(url: string | null | undefined): Promise<void> {
  if (!url) return;

  const base = getPublicBaseUrl();
  if (!url.startsWith(`${base}/`)) return;

  const key = url.slice(base.length + 1);

  try {
    await getClient().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }));
  } catch (err) {
    console.error(`Failed to delete orphaned photo object "${key}":`, err);
  }
}
