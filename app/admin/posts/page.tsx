import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { deletePostAction } from "@/lib/actions/post";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: true,
      _count: {
        select: {
          comments: true
        }
      }
    }
  });

  return (
    <AdminShell title="Posts">
      <div className="admin-table__actions" style={{ marginBottom: 18 }}>
        <p>Create drafts, then switch to published when a post is ready for the live site.</p>
        <Link href="/admin/posts/new" className="primary-button">
          New post
        </Link>
      </div>
      <div className="admin-table">
        {posts.map((post) => (
          <div className="admin-row panel" key={post.id}>
            <div>
              <h3>{post.title}</h3>
              <div className="admin-table__meta">
                <span>{post.category.name}</span>
                <span>{post.status}</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
            <div>{post.featured ? "Featured" : "Standard"}</div>
            <div>
              <div>{post.latest ? "Latest grid" : "Hidden from latest"}</div>
              <div className="admin-table__meta">
                <span>{post.likesCount} likes</span>
                <span>{post._count.comments} comments</span>
              </div>
            </div>
            <div className="admin-actions">
              <Link href={`/admin/posts/${post.id}`} className="secondary-button">
                Edit
              </Link>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="secondary-button">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
