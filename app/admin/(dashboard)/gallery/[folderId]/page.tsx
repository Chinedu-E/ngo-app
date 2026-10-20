import { notFound } from "next/navigation";
import { FolderDetail } from "@/components/admin/folder-detail";
import { getFolderById } from "@/lib/gallery/store";

export const dynamic = "force-dynamic";

export default async function AdminFolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  const folder = await getFolderById(folderId);
  if (!folder) notFound();
  return <FolderDetail folder={folder} />;
}
