import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PostEngagement } from "@/components/post-engagement";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPostBySlug } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";
import { formatDate, isRichTextContent, parsePostContent, sanitizePostHtml, splitPostTags } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "Post Not Found"
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title,
      description,
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
      title,
      description,
      images: [post.heroImage]
    }
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const likedCookie = (await cookies()).get("zenmora-liked-posts")?.value ?? "";

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const contentBlocks = parsePostContent(post.content);
  const richTextContent = isRichTextContent(post.content) ? sanitizePostHtml(post.content) : null;
  const tags = splitPostTags(post.tags);
  const initialLiked = likedCookie.split(",").includes(post.id);

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <article className="article-shell">
          <div className="meta-bar">
            <span>{post.category.name}</span>
            <span>{formatDate(post.publishedAt)}</span>
            {post.authorName ? <span>By {post.authorName}</span> : null}
          </div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="image-frame" style={{ backgroundImage: `url(${post.heroImage})`, marginTop: 24, borderRadius: 24 }} />

          {tags.length ? (
            <div className="tag-row" style={{ marginTop: 18 }}>
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="article-content">
            {richTextContent ? (
              <div dangerouslySetInnerHTML={{ __html: richTextContent }} />
            ) : (
              contentBlocks.map((block, index) => {
                if (block.type === "heading") {
                  return <h2 key={`${block.type}-${index}`}>{block.text}</h2>;
                }

                if (block.type === "image") {
                  return (
                    <figure key={`${block.type}-${index}`} className="article-figure">
                      <div className="image-frame" style={{ backgroundImage: `url(${block.url})`, minHeight: 320 }} />
                      {block.alt ? <figcaption>{block.alt}</figcaption> : null}
                    </figure>
                  );
                }

                if (block.type === "file") {
                  return null;
                }

                if (block.type === "list") {
                  return (
                    <ul key={`${block.type}-${index}`} className="article-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote key={`${block.type}-${index}`} className="article-quote">
                      {block.text}
                    </blockquote>
                  );
                }

                return <p key={`${block.type}-${index}`}>{block.text}</p>;
              })
            )}
          </div>

          <PostEngagement
            comments={post.comments.map((comment) => ({
              id: comment.id,
              name: comment.name,
              content: comment.content,
              createdAt: comment.createdAt.toISOString()
            }))}
            commentsCount={post._count.comments}
            initialLiked={initialLiked}
            likesCount={post.likesCount}
            slug={post.slug}
          />
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
