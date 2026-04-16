import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginationControls } from "@/components/pagination-controls";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getCategoryPageData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = await getCategoryPageData(slug);
  const category = categoryData?.category;

  if (!category) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: category.name,
    description: category.description || `Browse published ${category.name.toLowerCase()} inspiration from Zenmora Co.`,
    alternates: {
      canonical: `/category/${category.slug}`
    }
  };
}

function parsePageNumber(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function getCategoryHighlights(categoryName: string) {
  const copy: Record<string, string[]> = {
    bedroom: ["Layer soft neutrals with quiet contrast.", "Prioritize texture over clutter for a calmer room."],
    kitchen: ["Mix practical surfaces with warmer accents.", "Keep counters styled, but never crowded."],
    "living-room": ["Anchor the room with one large soft-texture piece.", "Use low-contrast tones to make the space breathe."],
    outdoor: ["Think in evening atmosphere, not just daytime function.", "Balance planting, lighting, and seating in equal measure."]
  };

  return copy[categoryName] ?? ["Build around warmth, light, and restraint.", "Choose fewer objects with better texture and scale."];
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const pageParams = await searchParams;
  const page = parsePageNumber(pageParams?.page);
  const categoryData = await getCategoryPageData(slug, page);

  if (!categoryData) {
    notFound();
  }

  const { category, featuredPost, posts, totalCount, totalPages, page: currentPage } = categoryData;
  const highlights = getCategoryHighlights(category.slug);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="category-hero panel panel--editorial">
          <div className="category-hero__content">
            <div className="eyebrow">Category</div>
            <h1 className="listing-hero__title">{category.name}</h1>
            <p>{category.description || `Browse curated ${category.name.toLowerCase()} stories, styling ideas, and warm editorial inspiration.`}</p>
          </div>
          <div className="category-stats">
            <div className="stat-card">
              <div className="eyebrow">Published</div>
              <h2>{totalCount}</h2>
            </div>
            <div className="stat-card">
              <div className="eyebrow">Pages</div>
              <h2>{totalPages}</h2>
            </div>
          </div>
        </section>

        <section className="category-guide panel panel--editorial">
          <div>
            <div className="eyebrow">What defines this room</div>
            <h2>{category.heroLabel || `${category.name} ideas`}</h2>
          </div>
          <div className="category-guide__points">
            {highlights.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </section>

        {featuredPost ? (
          <section className="category-feature">
            <div className="section-heading">
              <div className="section-heading__title">
                <h2>Featured Story</h2>
              </div>
            </div>
            <article className="category-feature__card">
              <div
                className="image-frame"
                style={{ backgroundImage: `url(${featuredPost.heroImage})` }}
                aria-label={featuredPost.heroAlt}
              />
              <div className="panel panel--editorial category-feature__content">
                <div className="meta-bar">
                  <span>{category.name}</span>
                  <span>{formatDate(featuredPost.publishedAt)}</span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="primary-button">
                  Read story
                </Link>
              </div>
            </article>
          </section>
        ) : null}

        <section className="section section--tight">
          <div className="section-heading">
            <div className="section-heading__title">
              <h2>More in {category.name}</h2>
            </div>
          </div>
          {posts.length ? (
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="panel panel--editorial">
              <p>
                {featuredPost
                  ? `There are no additional posts on this page yet.`
                  : `No published posts are available in ${category.name} yet.`}
              </p>
            </div>
          )}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${category.slug}`}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
