export type GalleryPhoto = {
  id: string;
  key: string;
  url: string;
  caption?: string;
  createdAt: string;
};

export type GalleryFolder = {
  id: string;
  title: string;
  description: string;
  coverPhotoId?: string;
  photos: GalleryPhoto[];
  createdAt: string;
};

export function getFolderCover(folder: GalleryFolder): GalleryPhoto | undefined {
  if (folder.coverPhotoId) {
    const cover = folder.photos.find((photo) => photo.id === folder.coverPhotoId);
    if (cover) return cover;
  }
  return folder.photos[0];
}
