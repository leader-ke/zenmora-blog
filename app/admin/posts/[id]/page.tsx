import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { PostEditorForm } from "@/components/post-editor-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell title="Edit Post">
      <PostEditorForm categories={categories} post={post} />
    </AdminShell>
  );
}
