import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getShopItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse curated Zenmora Co. decor finds and editorial product picks."
};

export default async function ShopPage() {
  const items = await getShopItems();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="listing-hero panel panel--editorial">
          <div>
            <div className="eyebrow">Curated shop</div>
            <h1 className="listing-hero__title">Shop the Look</h1>
            <p>Editorial decor picks, warm neutral accents, and soft-finish objects that fit the Zenmora visual language.</p>
          </div>
          <div className="listing-hero__meta">
            <span>{items.length} curated products</span>
            <span>Outbound links only</span>
          </div>
        </section>

        {items.length ? (
          <div className="shop-grid">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="shop-card shop-card--compact"
                target="_blank"
                rel="noreferrer"
              >
                <div className="image-frame image-frame--small" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="shop-card__body">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                  {item.retailer ? <div className="category-tile__meta">{item.retailer}</div> : null}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="panel panel--editorial">
            <p>No shop items are published yet.</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
