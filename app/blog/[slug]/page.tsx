import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { excerptParagraphs, formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "Post Not Found"
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: getSiteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt?.toISOString(),
      images: [
        {
          url: post.heroImage,
          alt: post.heroAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage]
    }
  };
}

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
