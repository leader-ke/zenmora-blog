import type { CSSProperties } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getExploreCategories, getFeaturedPost, getLatestPosts, getSiteContent } from "@/lib/data";
import { subscribeAction } from "@/lib/actions";

const shopItems = [
  { name: "Stone Table Lamp", price: "$39", image: "/images/shop-lamp.svg" },
  { name: "Textured Shade", price: "$139", image: "/images/shop-shade.svg" },
  { name: "Framed Botanicals", price: "$40", image: "/images/shop-frames.svg" },
  { name: "Wood Tray", price: "$26", image: "/images/shop-tray.svg" }
];

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{ subscribed?: string }>;
}) {
  const [siteContent, categories, featuredPost, latestPosts, params] = await Promise.all([
    getSiteContent(),
    getExploreCategories(),
    getFeaturedPost(),
    getLatestPosts(),
    searchParams
  ]);

  const subscribed = params?.subscribed;

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell">
        <section className="hero" style={{ "--hero-image": `url(${siteContent.heroImage})` } as CSSProperties}>
          <div className="hero__content">
            <div className="brandmark">{siteContent.heroTitle}</div>
            <p className="eyebrow">{siteContent.heroSubtitle}</p>
            <Link href={siteContent.heroCtaHref} className="primary-button">
              {siteContent.heroCtaLabel}
            </Link>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-heading__title">
              <h2>Explore By Room</h2>
            </div>
          </div>
          <div className="explore-grid">
            {categories.map((category) => {
              const lead = category.posts[0];
              return (
                <Link key={category.id} href={`/category/${category.slug}`} className="category-tile">
                  <div
                    className="image-frame image-frame--small"
                    style={{ backgroundImage: `url(${lead?.heroImage ?? siteContent.heroImage})` }}
                  />
                  <div className="category-tile__body">
                    <h3>{category.heroLabel || category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {featuredPost ? (
          <section className="section">
            <div className="trending">
              <div className="panel">
                <h2>{siteContent.trendingTitle}</h2>
                <p>{siteContent.trendingBody}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="primary-button">
                  {siteContent.trendingCtaLabel}
                </Link>
              </div>
              <div
                className="image-frame"
                style={{ backgroundImage: `url(${siteContent.trendingImage || featuredPost.heroImage})` }}
              />
            </div>
          </section>
        ) : null}

        <section className="section">
          <div className="section-heading">
            <div className="section-heading__title">
              <h2>Latest Inspiration</h2>
            </div>
            <Link href="/blog">See All</Link>
          </div>
          <div className="post-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div className="section-heading__title">
              <h2>Shop the Look</h2>
            </div>
          </div>
          <div className="shop-grid">
            {shopItems.map((item) => (
              <div key={item.name} className="shop-card">
                <div className="image-frame image-frame--small" style={{ backgroundImage: `url(${item.image})` }} />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="newsletter panel">
            <div>
              <h2>{siteContent.newsletterTitle}</h2>
              <p>{siteContent.newsletterBody}</p>
              {subscribed === "1" ? <div className="status-note">{siteContent.newsletterSuccess}</div> : null}
              {subscribed === "invalid" ? <div className="status-note">Enter a valid email address.</div> : null}
            </div>
            <form action={subscribeAction}>
              <input type="email" name="email" placeholder={siteContent.newsletterPlaceholder} required />
              <button type="submit" className="primary-button">
                {siteContent.newsletterButtonLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
