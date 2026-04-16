import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [postCount, draftCount, subscriberCount, latestPost] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.subscriber.count(),
    prisma.post.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" }
    })
  ]);

  return (
    <AdminShell title="Overview">
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginBottom: 20 }}>
        <div className="stat-card">
          <div className="eyebrow">Posts</div>
          <h2>{postCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Drafts</div>
          <h2>{draftCount}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Subscribers</div>
          <h2>{subscriberCount}</h2>
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
