import type { Metadata } from "next";
import { PaginationControls } from "@/components/pagination-controls";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Browse all published Zenmora Co. stories across living rooms, bedrooms, kitchens, and outdoor spaces."
};

function parsePageNumber(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function BlogIndexPage({
  searchParams
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parsePageNumber(params?.page);
  const { posts, totalCount, totalPages, page: currentPage } = await getPublishedPosts(page);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="listing-hero panel panel--editorial">
          <div>
            <div className="eyebrow">Editorial archive</div>
            <h1 className="listing-hero__title">All Stories</h1>
            <p>Browse published Zenmora Co. stories across calm living rooms, quiet bedrooms, warm kitchens, and outdoor retreats.</p>
          </div>
          <div className="listing-hero__meta">
            <span>{totalCount} published stories</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </section>
        {posts.length ? (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="panel panel--editorial">
            <p>No published stories yet.</p>
          </div>
        )}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      </main>
      <SiteFooter />
    </div>
  );
}
