export const revalidate = 60;

import type { CSSProperties } from "react";
import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getExploreCategories, getFeaturedPost, getLatestPosts, getShopItems, getSiteContent } from "@/lib/data";

export default async function HomePage({
}: {
  searchParams?: Promise<{ subscribed?: string }>;
}) {
  const [siteContent, categories, featuredPost, latestPosts, shopItems] = await Promise.all([
    getSiteContent(),
    getExploreCategories(),
    getFeaturedPost(),
    getLatestPosts(),
    getShopItems({ take: 4, featuredOnly: true })
  ]);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell">
        <section className="hero hero--editorial" style={{ "--hero-image": `url(${siteContent.heroImage})` } as CSSProperties}>
          <div className="hero__content">
            <div className="brandmark hero__brand">{siteContent.heroTitle}</div>
            <p className="eyebrow hero__eyebrow">{siteContent.heroSubtitle}</p>
            <Link href={siteContent.heroCtaHref} className="primary-button">
              {siteContent.heroCtaLabel}
            </Link>
          </div>
        </section>

        <section className="section section--tight">
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
                    <div className="category-tile__meta">Zenmora Co.</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {featuredPost ? (
          <section className="section">
            <div className="trending">
              <div className="panel panel--editorial">
                <div className="eyebrow">Trending Now</div>
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
        </section>

        <section className="section section--tight">
          <div className="home-bottom-grid">
            <div className="shop-summary panel panel--editorial">
              <div className="eyebrow">Collected accents</div>
              <h2>Shop softly layered pieces.</h2>
              <p>Use these styled objects as placeholders for affiliate links, product pages, or your own curated finds.</p>
            </div>
            <div className="newsletter panel panel--editorial">
              <div>
                <div className="eyebrow">Join Zenmora Co.</div>
                <h2>{siteContent.newsletterTitle}</h2>
                <p>{siteContent.newsletterBody}</p>
              </div>
              <NewsletterSignup
                buttonLabel={siteContent.newsletterButtonLabel}
                placeholder={siteContent.newsletterPlaceholder}
                successMessage={siteContent.newsletterSuccess}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
