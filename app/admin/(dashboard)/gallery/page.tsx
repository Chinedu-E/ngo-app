import { GalleryManager } from "@/components/admin/gallery-manager";
import { getFolders } from "@/lib/gallery/store";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const folders = await getFolders();
  return <GalleryManager folders={folders} />;
}
