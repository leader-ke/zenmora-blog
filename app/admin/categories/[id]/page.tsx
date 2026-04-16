import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { saveCategoryAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  return (
    <AdminShell title="Edit Category">
      <form action={saveCategoryAction} className="editor-form panel">
        <input type="hidden" name="id" value={category.id} />
        <div className="input-row">
          <label>
            Name
            <input name="name" defaultValue={category.name} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={category.slug} />
          </label>
        </div>
        <div className="input-row">
          <label>
            Card title
            <input name="heroLabel" defaultValue={category.heroLabel ?? ""} />
          </label>
          <label>
            Description
            <input name="description" defaultValue={category.description ?? ""} />
          </label>
        </div>
        <button type="submit" className="primary-button">
          Update category
        </button>
      </form>
    </AdminShell>
  );
}
