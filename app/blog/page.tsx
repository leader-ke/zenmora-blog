import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/data";

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <div className="section-heading">
          <div className="section-heading__title">
            <h2>All Stories</h2>
          </div>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
