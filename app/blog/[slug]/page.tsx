import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug } from "@/lib/data";
import { excerptParagraphs, formatDate } from "@/lib/utils";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const paragraphs = excerptParagraphs(post.content);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <article className="article-shell">
          <div className="meta-bar">
            <span>{post.category.name}</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="image-frame" style={{ backgroundImage: `url(${post.heroImage})`, marginTop: 24, borderRadius: 24 }} />
          <div className="article-content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
