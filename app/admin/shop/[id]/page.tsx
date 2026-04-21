import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { saveShopItemAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function EditShopItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.shopItem.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  return (
    <AdminShell title="Edit Shop Item">
      <form action={saveShopItemAction} className="editor-form panel">
        <input type="hidden" name="id" value={item.id} />
        <div className="input-row">
          <label>
            Name
            <input name="name" defaultValue={item.name} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={item.slug} />
          </label>
        </div>
        <div className="input-row">
          <label>
            Price label
            <input name="price" defaultValue={item.price} required />
          </label>
          <label>
            Retailer
            <input name="retailer" defaultValue={item.retailer ?? ""} />
          </label>
        </div>
        <div className="input-row">
          <label>
            Product URL
            <input name="href" defaultValue={item.href} required />
          </label>
          <label>
            Sort order
            <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
          </label>
        </div>
        {item.image ? (
          <div className="shop-image-preview">
            <div className="image-frame image-frame--small" style={{ backgroundImage: `url(${item.image})` }} />
          </div>
        ) : null}
        <div className="input-row">
          <label>
            Image path
            <input name="image" defaultValue={item.image} />
          </label>
          <label>
            Replace image
            <input type="file" name="imageFile" accept="image/*" />
          </label>
        </div>
        <div className="input-row">
          <label>
            Image alt
            <input name="imageAlt" defaultValue={item.imageAlt} required />
          </label>
        </div>
        <div className="checkbox-row">
          <label>
            <input type="checkbox" name="featured" defaultChecked={item.featured} />
            Feature on homepage
          </label>
          <label>
            <input type="checkbox" name="active" defaultChecked={item.active} />
            Visible on site
          </label>
        </div>
        <button type="submit" className="primary-button">
          Update shop item
        </button>
      </form>
    </AdminShell>
  );
}
