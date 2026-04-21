import Link from "next/link";
import { formatDate } from "@/lib/utils";

type PostCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    heroImage: string;
    heroAlt: string;
    publishedAt: Date | null;
    likesCount: number;
    _count: {
      comments: number;
    };
    category?: {
      name: string;
      slug: string;
    };
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="image-frame image-frame--small" style={{ backgroundImage: `url(${post.heroImage})` }} aria-label={post.heroAlt} />
      <div className="post-card__meta">
        {post.category ? <Link href={`/category/${post.category.slug}`}>{post.category.name}</Link> : null}
        <span>{formatDate(post.publishedAt)}</span>
      </div>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <div className="article-meta" style={{ marginTop: 14 }}>
        <span>{post.likesCount} likes</span>
        <span>{post._count.comments} comments</span>
      </div>
    </article>
  );
}
