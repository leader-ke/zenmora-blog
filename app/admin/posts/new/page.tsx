import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { savePostAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function NewPostPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell title="New Post">
      <form action={savePostAction} className="editor-form panel">
        <div className="input-row">
          <label>
            Title
            <input name="title" required />
          </label>
          <label>
            Slug
            <input name="slug" placeholder="auto-generated-from-title" />
          </label>
        </div>
        <label>
          Excerpt
          <textarea name="excerpt" required />
        </label>
        <label>
          Content
          <textarea name="content" required style={{ minHeight: 280 }} />
        </label>
        <div className="input-row">
          <label>
            Category
            <select name="categoryId" required defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" defaultValue="DRAFT">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero image path
            <input name="heroImage" defaultValue="/images/hero-room.svg" required />
          </label>
          <label>
            Hero image alt
            <input name="heroAlt" defaultValue="Neutral interior scene" required />
          </label>
        </div>
        <div className="checkbox-row">
          <label>
            <input type="checkbox" name="featured" />
            Use as trending feature
          </label>
          <label>
            <input type="checkbox" name="latest" defaultChecked />
            Show in latest inspiration
          </label>
        </div>
        <button type="submit" className="primary-button">
          Save post
        </button>
      </form>
    </AdminShell>
  );
}
