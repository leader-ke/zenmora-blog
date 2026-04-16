import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PostCard } from "@/components/post-card";
import { getPostsByCategory } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getPostsByCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <div className="panel" style={{ marginBottom: 22 }}>
          <div className="eyebrow">Category</div>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
        </div>
        <div className="post-grid">
          {category.posts.map((post) => (
            <PostCard key={post.id} post={{ ...post, category }} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
