import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { savePostAction } from "@/lib/actions";
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
      <form action={savePostAction} className="editor-form panel">
        <input type="hidden" name="id" value={post.id} />
        <div className="input-row">
          <label>
            Title
            <input name="title" defaultValue={post.title} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={post.slug} />
          </label>
        </div>
        <label>
          Excerpt
          <textarea name="excerpt" defaultValue={post.excerpt} required />
        </label>
        <label>
          Content
          <textarea name="content" defaultValue={post.content} required style={{ minHeight: 280 }} />
        </label>
        <div className="input-row">
          <label>
            Category
            <select name="categoryId" defaultValue={post.categoryId} required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue={post.status}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero image path
            <input name="heroImage" defaultValue={post.heroImage} required />
          </label>
          <label>
            Hero image alt
            <input name="heroAlt" defaultValue={post.heroAlt} required />
          </label>
        </div>
        <div className="checkbox-row">
          <label>
            <input type="checkbox" name="featured" defaultChecked={post.featured} />
            Use as trending feature
          </label>
          <label>
            <input type="checkbox" name="latest" defaultChecked={post.latest} />
            Show in latest inspiration
          </label>
        </div>
        <button type="submit" className="primary-button">
          Update post
        </button>
      </form>
    </AdminShell>
  );
}
