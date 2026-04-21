import { AdminShell } from "@/components/admin-shell";
import { PostEditorForm } from "@/components/post-editor-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell title="New Post">
      <PostEditorForm categories={categories} />
    </AdminShell>
  );
}
