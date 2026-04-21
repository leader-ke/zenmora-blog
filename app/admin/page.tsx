import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [postCount, draftCount, subscriberCount, likeAggregate, commentCount, messageCount, latestPost] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.subscriber.count({ where: { status: "SUBSCRIBED" } }),
    prisma.post.aggregate({ _sum: { likesCount: true } }),
    prisma.comment.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.post.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" }
    })
  ]);

  return (
    <AdminShell title="Overview">
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card">
          <div className="eyebrow">Posts</div>
          <h2>{postCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Drafts</div>
          <h2>{draftCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Active subscribers</div>
          <h2>{subscriberCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Likes</div>
          <h2>{likeAggregate._sum.likesCount ?? 0}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Comments</div>
          <h2>{commentCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">New messages</div>
          <h2>{messageCount}</h2>
        </div>
      </section>
      <section className="admin-grid" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
        <div className="admin-card">
          <div className="eyebrow">Quick Actions</div>
          <div className="admin-nav">
            <Link href="/admin/posts/new" className="secondary-button">
              New post
            </Link>
            <Link href="/admin/homepage" className="secondary-button">
              Edit homepage
            </Link>
            <Link href="/admin/categories" className="secondary-button">
              Manage categories
            </Link>
            <Link href="/admin/shop" className="secondary-button">
              Manage shop
            </Link>
            <Link href="/admin/subscribers" className="secondary-button">
              View subscribers
            </Link>
            <Link href="/admin/messages" className="secondary-button">
              Contact inbox
            </Link>
          </div>
        </div>
        <div className="admin-card">
          <div className="eyebrow">Latest Publish</div>
          <h3>{latestPost?.title ?? "No published posts yet"}</h3>
          <p>{latestPost?.excerpt ?? "Publish your first post to populate the live site."}</p>
        </div>
      </section>
    </AdminShell>
  );
}
