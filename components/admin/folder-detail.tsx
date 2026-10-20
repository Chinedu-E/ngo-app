"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, Star, Trash2 } from "lucide-react";
import type { GalleryFolder } from "@/lib/gallery/types";
import { Button } from "@/components/ui/button";
import {
  confirmPhotoUploadAction,
  deletePhotoAction,
  getUploadUrlAction,
  setCoverPhotoAction,
  updateFolderAction,
  updatePhotoCaptionAction,
  type GalleryActionState,
} from "@/app/admin/gallery-actions";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/r2/constants";

const fieldClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-shadow";

type UploadItem = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
  progress: number;
};

const folderInitial: GalleryActionState = {};

export function FolderDetail({ folder }: { folder: GalleryFolder }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [editingMeta, setEditingMeta] = useState(false);
  const [folderState, folderAction, folderPending] = useActionState(
    updateFolderAction,
    folderInitial,
  );

  useEffect(() => {
    if (folderState.ok) {
      setEditingMeta(false);
      router.refresh();
    }
  }, [folderState.ok, router]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const files = Array.from(fileList);

    for (const file of files) {
      const localId = `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 6)}`;
      setUploads((prev) => [
        ...prev,
        { id: localId, name: file.name, status: "uploading", progress: 10 },
      ]);

      if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        setUploads((prev) =>
          prev.map((item) =>
            item.id === localId
              ? { ...item, status: "error", error: "Use JPEG, PNG, or WebP.", progress: 0 }
              : item,
          ),
        );
        continue;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setUploads((prev) =>
          prev.map((item) =>
            item.id === localId
              ? { ...item, status: "error", error: "File must be 20MB or smaller.", progress: 0 }
              : item,
          ),
        );
        continue;
      }

      try {
        const prepared = await getUploadUrlAction({
          folderId: folder.id,
          contentType: file.type,
          contentLength: file.size,
          fileName: file.name,
        });

        if ("error" in prepared) {
          setUploads((prev) =>
            prev.map((item) =>
              item.id === localId
                ? { ...item, status: "error", error: prepared.error, progress: 0 }
                : item,
            ),
          );
          continue;
        }

        setUploads((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, progress: 40 } : item)),
        );

        let putRes: Response;
        try {
          putRes = await fetch(prepared.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });
        } catch {
          throw new Error(
            "Could not reach R2 (often a CORS or network issue). Check bucket CORS allows PUT from this site.",
          );
        }

        if (!putRes.ok) {
          const detail = (await putRes.text().catch(() => "")).slice(0, 160);
          throw new Error(
            detail
              ? `Upload failed (${putRes.status}): ${detail}`
              : `Upload failed (${putRes.status}).`,
          );
        }

        setUploads((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, progress: 80 } : item)),
        );

        const confirmed = await confirmPhotoUploadAction({
          folderId: folder.id,
          photoId: prepared.photoId,
          key: prepared.key,
        });

        if ("error" in confirmed) {
          throw new Error(confirmed.error);
        }

        setUploads((prev) =>
          prev.map((item) =>
            item.id === localId ? { ...item, status: "done", progress: 100 } : item,
          ),
        );
        router.refresh();
      } catch (error) {
        setUploads((prev) =>
          prev.map((item) =>
            item.id === localId
              ? {
                  ...item,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed.",
                  progress: 0,
                }
              : item,
          ),
        );
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-forest transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        All folders
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl text-forest font-semibold">{folder.title}</h1>
          <p className="text-muted text-sm mt-2 max-w-2xl">{folder.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setEditingMeta(true)}>
            Edit details
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4" />
            Upload photos
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {editingMeta && (
        <div className="mb-8 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg text-forest font-semibold mb-4">Folder details</h2>
          <form action={folderAction} className="space-y-4">
            <input type="hidden" name="id" value={folder.id} />
            <div>
              <label htmlFor="edit-title" className="block text-sm font-semibold mb-2">
                Title
              </label>
              <input
                id="edit-title"
                name="title"
                required
                defaultValue={folder.title}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-semibold mb-2">
                Short description
              </label>
              <textarea
                id="edit-description"
                name="description"
                required
                maxLength={280}
                rows={3}
                defaultValue={folder.description}
                className={`${fieldClass} resize-y`}
              />
            </div>
            {folderState.error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {folderState.error}
              </p>
            )}
            <div className="flex gap-3">
              <Button type="submit" variant="primary" size="sm" loading={folderPending}>
                Save
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingMeta(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {uploads.length > 0 && (
        <div className="mb-8 space-y-2">
          {uploads.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-forest/10 bg-white px-4 py-3 text-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                {item.error && <p className="text-red-700 text-xs mt-0.5">{item.error}</p>}
                {item.status === "uploading" && (
                  <p className="text-muted text-xs mt-0.5">Uploading… {item.progress}%</p>
                )}
                {item.status === "done" && (
                  <p className="text-sage text-xs mt-0.5">Uploaded</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {folder.photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest/15 bg-white/60 px-6 py-16 text-center text-muted text-sm">
          No photos in this folder yet. Upload JPEG, PNG, or WebP files up to 20MB each.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {folder.photos.map((photo) => {
            const isCover = folder.coverPhotoId === photo.id;
            return (
              <article
                key={photo.id}
                className="rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-sm"
              >
                <div className="relative h-48 bg-beige">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || folder.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isCover && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-forest text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                      <Star className="w-3 h-3" />
                      Cover
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <CaptionForm folderId={folder.id} photoId={photo.id} caption={photo.caption} />
                  <div className="flex flex-wrap gap-2">
                    {!isCover && (
                      <form action={setCoverPhotoAction}>
                        <input type="hidden" name="folderId" value={folder.id} />
                        <input type="hidden" name="photoId" value={photo.id} />
                        <Button type="submit" variant="outline" size="sm">
                          Set as cover
                        </Button>
                      </form>
                    )}
                    <form action={deletePhotoAction}>
                      <input type="hidden" name="folderId" value={folder.id} />
                      <input type="hidden" name="photoId" value={photo.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm("Delete this photo?")) e.preventDefault();
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold border border-red-200 text-red-700 bg-white hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CaptionForm({
  folderId,
  photoId,
  caption,
}: {
  folderId: string;
  photoId: string;
  caption?: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updatePhotoCaptionAction, {});

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="folderId" value={folderId} />
      <input type="hidden" name="photoId" value={photoId} />
      <label className="block text-xs font-semibold text-muted uppercase tracking-wider">
        Caption (optional)
      </label>
      <div className="flex gap-2">
        <input
          name="caption"
          defaultValue={caption ?? ""}
          placeholder="Add a caption"
          className={fieldClass}
        />
        <Button type="submit" variant="outline" size="sm" loading={pending}>
          Save
        </Button>
      </div>
      {state.error && <p className="text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
