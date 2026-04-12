/**
 * Cloudflare R2 storage utility using aws4fetch (S3-compatible API).
 * Credentials read from TIMI_R2_* environment variables.
 */
import { AwsClient } from 'aws4fetch';

function getR2Client() {
  const accessKeyId     = process.env.TIMI_R2_ACCESS_KEY_ID ?? '';
  const secretAccessKey = process.env.TIMI_R2_SECRET_ACCESS_KEY ?? '';

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured (TIMI_R2_ACCESS_KEY_ID / TIMI_R2_SECRET_ACCESS_KEY)');
  }

  return new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: 's3',
  });
}

function getR2Endpoint() {
  return (process.env.TIMI_R2_ENDPOINT ?? '').replace(/\/$/, '');
}

function getBucketName() {
  return process.env.TIMI_R2_BUCKET_NAME ?? 'timi';
}

function getPublicUrl() {
  return (process.env.TIMI_R2_PUBLIC_URL ?? '').replace(/\/$/, '');
}

/**
 * Upload a file buffer to R2.
 * @returns Public URL of the uploaded file
 */
export async function uploadToR2(
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<string> {
  const client   = getR2Client();
  const endpoint = getR2Endpoint();
  const bucket   = getBucketName();

  const url = `${endpoint}/${bucket}/${key}`;

  const resp = await client.fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(body.byteLength),
    },
    body: new Uint8Array(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`R2 upload failed ${resp.status}: ${errText}`);
  }

  return `${getPublicUrl()}/${key}`;
}

/**
 * Delete an object from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client   = getR2Client();
  const endpoint = getR2Endpoint();
  const bucket   = getBucketName();

  const url = `${endpoint}/${bucket}/${key}`;
  await client.fetch(url, { method: 'DELETE' });
}

/**
 * Generate a unique R2 key for a parse job file.
 */
export function makeR2Key(filename: string, prefix = 'parse'): string {
  const ts  = Date.now();
  const ext = filename.split('.').pop() ?? 'bin';
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60);
  return `${prefix}/${ts}_${safe}`;
}
