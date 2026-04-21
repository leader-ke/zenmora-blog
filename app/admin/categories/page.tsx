import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } }
  });

  return (
    <AdminShell title="Categories">
      <section className="panel" style={{ marginBottom: 18 }}>
        <h3>Create or update categories</h3>
        <form action={saveCategoryAction} className="editor-form">
          <div className="input-row">
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Slug
              <input name="slug" placeholder="auto-generated-from-name" />
            </label>
          </div>
          <div className="input-row">
            <label>
              Card title
              <input name="heroLabel" />
            </label>
            <label>
              Description
              <input name="description" />
            </label>
          </div>
          <button type="submit" className="primary-button">
            Save category
          </button>
        </form>
      </section>
      <div className="admin-table">
        {categories.map((category) => (
          <div key={category.id} className="admin-row panel">
            <div>
              <h3>{category.name}</h3>
              <div className="admin-table__meta">
                <span>/{category.slug}</span>
                <span>{category._count.posts} posts</span>
              </div>
            </div>
            <div>{category.heroLabel || "No card title"}</div>
            <div>{category.description || "No description"}</div>
            <div className="admin-actions">
              <Link href={`/admin/categories/${category.id}`} className="secondary-button">
                Edit
              </Link>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <button type="submit" className="secondary-button">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
