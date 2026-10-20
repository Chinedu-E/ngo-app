import { readJsonDocument, writeJsonDocument } from "@/lib/storage/json-store";
import type { GalleryFolder } from "@/lib/gallery/types";

const R2_KEY = "meta/gallery.json";
const LOCAL_PATH = "data/gallery.json";

export async function readFolders(): Promise<GalleryFolder[]> {
  const parsed = await readJsonDocument<GalleryFolder[]>({
    r2Key: R2_KEY,
    localPath: LOCAL_PATH,
    fallback: [],
  });
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid gallery data.");
  }
  return parsed;
}

export async function writeFolders(folders: GalleryFolder[]): Promise<void> {
  await writeJsonDocument({
    r2Key: R2_KEY,
    localPath: LOCAL_PATH,
    data: folders,
  });
}

export async function getFolders(): Promise<GalleryFolder[]> {
  const folders = await readFolders();
  return folders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Folders that have at least one photo — for the public home gallery. */
export async function getPublicFolders(): Promise<GalleryFolder[]> {
  const folders = await getFolders();
  return folders.filter((folder) => folder.photos.length > 0);
}

export async function getFolderById(id: string): Promise<GalleryFolder | undefined> {
  const folders = await readFolders();
  return folders.find((folder) => folder.id === id);
}

export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "folder";
}

export function createUniqueFolderId(title: string, existing: GalleryFolder[]): string {
  const base = slugifyTitle(title);
  if (!existing.some((f) => f.id === base)) return base;
  let i = 2;
  while (existing.some((f) => f.id === `${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export function createPhotoId(): string {
  return `photo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
