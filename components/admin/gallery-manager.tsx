"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderPlus, Images, Trash2 } from "lucide-react";
import { getFolderCover, type GalleryFolder } from "@/lib/gallery/types";
import { Button } from "@/components/ui/button";
import {
  createFolderAction,
  deleteFolderAction,
  type GalleryActionState,
} from "@/app/admin/gallery-actions";

const initialState: GalleryActionState = {};

const fieldClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-shadow";

export function GalleryManager({ folders }: { folders: GalleryFolder[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [state, formAction, pending] = useActionState(createFolderAction, initialState);

  useEffect(() => {
    if (state.ok && state.folderId) {
      setCreating(false);
      router.push(`/admin/gallery/${state.folderId}`);
      router.refresh();
    }
  }, [state.ok, state.folderId, router]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-forest font-semibold">Gallery</h1>
          <p className="text-muted text-sm mt-1">
            Create folders, then upload photos. Folders with photos appear on the home page.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <FolderPlus className="w-4 h-4" />
          New folder
        </Button>
      </div>

      {creating && (
        <div className="mb-10 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg text-forest font-semibold mb-4">New folder</h2>
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="folder-title" className="block text-sm font-semibold text-foreground mb-2">
                Title
              </label>
              <input id="folder-title" name="title" required className={fieldClass} />
            </div>
            <div>
              <label
                htmlFor="folder-description"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Short description
              </label>
              <textarea
                id="folder-description"
                name="description"
                required
                maxLength={280}
                rows={3}
                className={`${fieldClass} resize-y`}
                placeholder="A brief note about this collection of photos"
              />
            </div>
            {state.error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {state.error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="primary" size="sm" loading={pending}>
                Create folder
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {folders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-forest/15 bg-white/60 px-6 py-16 text-center">
          <Images className="w-8 h-8 text-sage mx-auto mb-3" />
          <p className="text-muted text-sm">No folders yet. Create one to start uploading photos.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {folders.map((folder) => {
            const cover = getFolderCover(folder);
            return (
              <article
                key={folder.id}
                className="rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-sm flex flex-col"
              >
                <Link href={`/admin/gallery/${folder.id}`} className="block relative h-44 bg-beige">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.url}
                      alt={folder.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
                      No photos yet
                    </div>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg text-forest font-semibold">{folder.title}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2 flex-1">{folder.description}</p>
                  <p className="text-xs text-sage font-semibold mt-3">
                    {folder.photos.length} {folder.photos.length === 1 ? "photo" : "photos"}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Button href={`/admin/gallery/${folder.id}`} variant="outline" size="sm">
                      Manage
                    </Button>
                    <form action={deleteFolderAction}>
                      <input type="hidden" name="id" value={folder.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (
                            !confirm(
                              `Delete folder “${folder.title}” and all of its photos?`,
                            )
                          ) {
                            e.preventDefault();
                          }
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
