import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  isAllowedImageType,
  MAX_UPLOAD_BYTES,
  type AllowedImageType,
} from "@/lib/r2/constants";

export {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  extensionForMime,
  isAllowedImageType,
  type AllowedImageType,
} from "@/lib/r2/constants";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function getR2PublicBaseUrl(): string {
  return requireEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
}

export function getR2BucketName(): string {
  return requireEnv("R2_BUCKET_NAME");
}

export function getR2Client(): S3Client {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
    // R2 requires path-style URLs; virtual-hosted style does not resolve.
    forcePathStyle: true,
  });
}

export function publicUrlForKey(key: string): string {
  return `${getR2PublicBaseUrl()}/${key}`;
}

export async function createPresignedUploadUrl(params: {
  key: string;
  contentType: AllowedImageType;
  contentLength: number;
}): Promise<string> {
  if (params.contentLength <= 0 || params.contentLength > MAX_UPLOAD_BYTES) {
    throw new Error(`File must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes.`);
  }
  if (!isAllowedImageType(params.contentType)) {
    throw new Error("Unsupported image type.");
  }

  const client = getR2Client();
  // Sign ContentType only — browsers set Content-Length automatically on PUT.
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: params.key,
    ContentType: params.contentType,
  });

  return getSignedUrl(client, command, { expiresIn: 60 * 10 });
}

export async function deleteR2Object(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    }),
  );
}
