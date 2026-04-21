import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { deleteShopItemAction, saveShopItemAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminShopPage() {
  await requireAdmin();

  const items = await prisma.shopItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });

  return (
    <AdminShell title="Shop">
      <section className="panel" style={{ marginBottom: 18 }}>
        <h3>Add a shop item</h3>
        <form action={saveShopItemAction} className="editor-form">
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
              Price label
              <input name="price" placeholder="$39" required />
            </label>
            <label>
              Retailer
              <input name="retailer" placeholder="Zenmora Finds" />
            </label>
          </div>
          <div className="input-row">
            <label>
              Product URL
              <input name="href" placeholder="https://example.com/product" required />
            </label>
            <label>
              Sort order
              <input name="sortOrder" type="number" defaultValue={0} />
            </label>
          </div>
          <div className="input-row">
            <label>
              Image path
              <input name="image" defaultValue="/images/shop-lamp.svg" />
            </label>
            <label>
              Image upload
              <input type="file" name="imageFile" accept="image/*" />
            </label>
          </div>
          <div className="input-row">
            <label>
              Image alt
              <input name="imageAlt" defaultValue="Decor product" required />
            </label>
          </div>
          <div className="checkbox-row">
            <label>
              <input type="checkbox" name="featured" defaultChecked />
              Feature on homepage
            </label>
            <label>
              <input type="checkbox" name="active" defaultChecked />
              Visible on site
            </label>
          </div>
          <button type="submit" className="primary-button">
            Save shop item
          </button>
        </form>
      </section>

      <div className="admin-table">
        {items.map((item) => (
          <div key={item.id} className="admin-row panel">
            <div>
              <h3>{item.name}</h3>
              <div className="admin-table__meta">
                <span>{item.price}</span>
                <span>{item.retailer || "No retailer"}</span>
              </div>
            </div>
            <div>{item.featured ? "Homepage" : "Shop only"}</div>
            <div>{item.active ? "Visible" : "Hidden"}</div>
            <div className="admin-actions">
              <Link href={`/admin/shop/${item.id}`} className="secondary-button">
                Edit
              </Link>
              <form action={deleteShopItemAction}>
                <input type="hidden" name="id" value={item.id} />
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
