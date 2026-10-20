import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "fs";
import path from "path";
import { getR2BucketName, getR2Client } from "@/lib/r2/client";

/**
 * Persist small JSON documents.
 * - When R2 credentials are set (production): store in the bucket under `meta/…`
 * - Otherwise: local `data/` files for offline/dev without R2
 *
 * Serverless hosts (e.g. Vercel) cannot reliably write the git `data/` folder.
 */

function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim(),
  );
}

async function readLocalJson<T>(relativePath: string, fallback: T): Promise<T> {
  const fullPath = path.join(process.cwd(), relativePath);
  try {
    const raw = await fs.readFile(fullPath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

async function writeLocalJson<T>(relativePath: string, data: T): Promise<void> {
  const fullPath = path.join(process.cwd(), relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function readR2Json<T>(key: string, fallback: T): Promise<T> {
  const client = getR2Client();
  try {
    const result = await client.send(
      new GetObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
      }),
    );
    const raw = await result.Body?.transformToString("utf8");
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    const name = (error as { name?: string }).name;
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata
      ?.httpStatusCode;
    if (name === "NoSuchKey" || status === 404) {
      return fallback;
    }
    throw error;
  }
}

async function writeR2Json<T>(key: string, data: T): Promise<void> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: `${JSON.stringify(data, null, 2)}\n`,
      ContentType: "application/json",
    }),
  );
}

export async function readJsonDocument<T>(options: {
  r2Key: string;
  localPath: string;
  fallback: T;
}): Promise<T> {
  if (isR2Configured()) {
    const fromR2 = await readR2Json<T>(options.r2Key, options.fallback);
    // First deploy: seed R2 from the committed local file if R2 is empty.
    if (
      JSON.stringify(fromR2) === JSON.stringify(options.fallback) &&
      options.localPath
    ) {
      const fromLocal = await readLocalJson<T>(options.localPath, options.fallback);
      if (JSON.stringify(fromLocal) !== JSON.stringify(options.fallback)) {
        await writeR2Json(options.r2Key, fromLocal);
        return fromLocal;
      }
    }
    return fromR2;
  }
  return readLocalJson(options.localPath, options.fallback);
}

export async function writeJsonDocument<T>(options: {
  r2Key: string;
  localPath: string;
  data: T;
}): Promise<void> {
  if (isR2Configured()) {
    await writeR2Json(options.r2Key, options.data);
    // Best-effort local mirror for local/dev convenience (ignored on read-only hosts).
    try {
      await writeLocalJson(options.localPath, options.data);
    } catch {
      // ignore
    }
    return;
  }
  await writeLocalJson(options.localPath, options.data);
}
