"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { getFolderCover, type GalleryFolder } from "@/lib/gallery/types";

type Props = {
  folders: GalleryFolder[];
};

export default function GallerySection({ folders }: Props) {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const activeFolder = folders.find((folder) => folder.id === activeFolderId) ?? null;
  const photos = activeFolder?.photos ?? [];
  const currentPhoto = photos[photoIndex];

  const close = useCallback(() => {
    setActiveFolderId(null);
    setPhotoIndex(0);
  }, []);

  const openFolder = (folderId: string) => {
    setActiveFolderId(folderId);
    setPhotoIndex(0);
  };

  const goPrev = useCallback(() => {
    setPhotoIndex((index) => (photos.length ? (index - 1 + photos.length) % photos.length : 0));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setPhotoIndex((index) => (photos.length ? (index + 1) % photos.length : 0));
  }, [photos.length]);

  useEffect(() => {
    if (!activeFolder) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeFolder, close, goPrev, goNext]);

  // Simple swipe support
  useEffect(() => {
    if (!activeFolder) return;
    let startX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.changedTouches[0]?.clientX ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX == null) return;
      const endX = e.changedTouches[0]?.clientX ?? startX;
      const delta = endX - startX;
      if (Math.abs(delta) > 50) {
        if (delta > 0) goPrev();
        else goNext();
      }
      startX = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeFolder, goPrev, goNext]);

  if (folders.length === 0) return null;

  return (
    <>
      <Section variant="white" id="gallery">
        <SectionHeader
          eyebrow="Gallery"
          title="Moments from our community"
          description="Explore photo collections from ThriveParth gatherings, programs, and celebrations."
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {folders.map((folder) => {
            const cover = getFolderCover(folder);
            if (!cover) return null;
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => openFolder(folder.id)}
                className="group text-left rounded-2xl border border-forest/10 bg-beige overflow-hidden shadow-sm hover:border-sage/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/50"
              >
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <Image
                    src={cover.url}
                    alt={folder.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-forest font-semibold">{folder.title}</h3>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{folder.description}</p>
                  <p className="text-xs font-semibold text-sage mt-3 uppercase tracking-wider">
                    {folder.photos.length}{" "}
                    {folder.photos.length === 1 ? "photo" : "photos"} · View
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {activeFolder && currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeFolder.title} gallery`}
          className="fixed inset-0 z-[60] bg-forest/90 backdrop-blur-sm flex flex-col"
        >
          <div className="flex items-start justify-between gap-4 px-4 sm:px-6 pt-4 sm:pt-6 text-white">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-sage">Gallery</p>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold mt-1 truncate">
                {activeFolder.title}
              </h2>
              <p className="text-sm text-white/75 mt-1 line-clamp-2 max-w-2xl">
                {activeFolder.description}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="shrink-0 rounded-lg border border-white/20 p-2 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-6 py-4 min-h-0">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="shrink-0 rounded-full border border-white/20 bg-white/10 p-2.5 sm:p-3 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="relative flex-1 max-w-5xl h-full min-h-[240px] sm:min-h-[360px]">
              {/* Use img for arbitrary R2 hosts; next/image still used in the grid when hostname is configured */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || activeFolder.title}
                className="absolute inset-0 m-auto max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="shrink-0 rounded-full border border-white/20 bg-white/10 p-2.5 sm:p-3 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="px-4 sm:px-6 pb-6 text-center text-white">
            {currentPhoto.caption && (
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
                {currentPhoto.caption}
              </p>
            )}
            <p className="text-xs text-white/60 mt-2">
              {photoIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
