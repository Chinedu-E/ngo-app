"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  createPhotoId,
  createUniqueFolderId,
  getFolderById,
  readFolders,
  writeFolders,
} from "@/lib/gallery/store";
import type { GalleryFolder, GalleryPhoto } from "@/lib/gallery/types";
import {
  createPresignedUploadUrl,
  deleteR2Object,
  extensionForMime,
  isAllowedImageType,
  MAX_UPLOAD_BYTES,
  publicUrlForKey,
  type AllowedImageType,
} from "@/lib/r2/client";

export type GalleryActionState = {
  ok?: boolean;
  error?: string;
  folderId?: string;
};

function revalidateGallery(): void {
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery", "layout");
}

export async function createFolderAction(
  _prev: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title || !description) {
    return { error: "Title and description are required." };
  }
  if (description.length > 280) {
    return { error: "Description must be 280 characters or fewer." };
  }

  const folders = await readFolders();
  const folder: GalleryFolder = {
    id: createUniqueFolderId(title, folders),
    title,
    description,
    photos: [],
    createdAt: new Date().toISOString(),
  };
  folders.push(folder);
  await writeFolders(folders);
  revalidateGallery();
  return { ok: true, folderId: folder.id };
}

export async function updateFolderAction(
  _prev: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !title || !description) {
    return { error: "Title and description are required." };
  }
  if (description.length > 280) {
    return { error: "Description must be 280 characters or fewer." };
  }

  const folders = await readFolders();
  const index = folders.findIndex((folder) => folder.id === id);
  if (index === -1) return { error: "Folder not found." };

  folders[index] = { ...folders[index], title, description };
  await writeFolders(folders);
  revalidateGallery();
  return { ok: true, folderId: id };
}

export async function deleteFolderAction(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const folders = await readFolders();
  const folder = folders.find((f) => f.id === id);
  if (!folder) return;

  await Promise.all(
    folder.photos.map(async (photo) => {
      try {
        await deleteR2Object(photo.key);
      } catch {
        // Continue deleting metadata even if an object is already gone.
      }
    }),
  );

  await writeFolders(folders.filter((f) => f.id !== id));
  revalidateGallery();
}

export async function getUploadUrlAction(input: {
  folderId: string;
  contentType: string;
  contentLength: number;
  fileName: string;
}): Promise<{ uploadUrl: string; key: string; photoId: string; publicUrl: string } | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  if (!isAllowedImageType(input.contentType)) {
    return { error: "Only JPEG, PNG, and WebP images are allowed." };
  }
  if (input.contentLength <= 0 || input.contentLength > MAX_UPLOAD_BYTES) {
    return { error: "Each image must be 20MB or smaller." };
  }

  const folder = await getFolderById(input.folderId);
  if (!folder) return { error: "Folder not found." };

  const photoId = createPhotoId();
  const ext = extensionForMime(input.contentType as AllowedImageType);
  const key = `gallery/${folder.id}/${photoId}.${ext}`;

  try {
    const uploadUrl = await createPresignedUploadUrl({
      key,
      contentType: input.contentType,
      contentLength: input.contentLength,
    });
    return {
      uploadUrl,
      key,
      photoId,
      publicUrl: publicUrlForKey(key),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to prepare upload.",
    };
  }
}

export async function confirmPhotoUploadAction(input: {
  folderId: string;
  photoId: string;
  key: string;
  caption?: string;
}): Promise<{ ok: true; photo: GalleryPhoto } | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const folders = await readFolders();
  const index = folders.findIndex((folder) => folder.id === input.folderId);
  if (index === -1) return { error: "Folder not found." };

  const expectedPrefix = `gallery/${input.folderId}/`;
  if (!input.key.startsWith(expectedPrefix) || !input.key.includes(input.photoId)) {
    return { error: "Invalid upload key." };
  }

  const caption = input.caption?.trim();
  const photo: GalleryPhoto = {
    id: input.photoId,
    key: input.key,
    url: publicUrlForKey(input.key),
    ...(caption ? { caption } : {}),
    createdAt: new Date().toISOString(),
  };

  const folder = folders[index];
  folder.photos = [...folder.photos, photo];
  if (!folder.coverPhotoId) {
    folder.coverPhotoId = photo.id;
  }
  folders[index] = folder;
  await writeFolders(folders);
  revalidateGallery();
  return { ok: true, photo };
}

export async function updatePhotoCaptionAction(
  _prev: GalleryActionState,
  formData: FormData,
): Promise<GalleryActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Unauthorized." };
  }

  const folderId = String(formData.get("folderId") ?? "").trim();
  const photoId = String(formData.get("photoId") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  if (!folderId || !photoId) return { error: "Missing photo." };

  const folders = await readFolders();
  const folderIndex = folders.findIndex((folder) => folder.id === folderId);
  if (folderIndex === -1) return { error: "Folder not found." };

  const photos = folders[folderIndex].photos.map((photo) => {
    if (photo.id !== photoId) return photo;
    if (!caption) {
      const { caption: _removed, ...rest } = photo;
      return rest;
    }
    return { ...photo, caption };
  });

  folders[folderIndex] = { ...folders[folderIndex], photos };
  await writeFolders(folders);
  revalidateGallery();
  return { ok: true, folderId };
}

export async function setCoverPhotoAction(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }

  const folderId = String(formData.get("folderId") ?? "").trim();
  const photoId = String(formData.get("photoId") ?? "").trim();
  if (!folderId || !photoId) return;

  const folders = await readFolders();
  const index = folders.findIndex((folder) => folder.id === folderId);
  if (index === -1) return;
  if (!folders[index].photos.some((photo) => photo.id === photoId)) return;

  folders[index] = { ...folders[index], coverPhotoId: photoId };
  await writeFolders(folders);
  revalidateGallery();
}

export async function deletePhotoAction(formData: FormData): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }

  const folderId = String(formData.get("folderId") ?? "").trim();
  const photoId = String(formData.get("photoId") ?? "").trim();
  if (!folderId || !photoId) return;

  const folders = await readFolders();
  const index = folders.findIndex((folder) => folder.id === folderId);
  if (index === -1) return;

  const folder = folders[index];
  const photo = folder.photos.find((p) => p.id === photoId);
  if (!photo) return;

  try {
    await deleteR2Object(photo.key);
  } catch {
    // Still remove from metadata.
  }

  const photos = folder.photos.filter((p) => p.id !== photoId);
  const coverPhotoId =
    folder.coverPhotoId === photoId ? photos[0]?.id : folder.coverPhotoId;

  folders[index] = { ...folder, photos, coverPhotoId };
  await writeFolders(folders);
  revalidateGallery();
}
