import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminSubscribersPage() {
  await requireAdmin();

  const [subscribers, latestSubscriber] = await Promise.all([
    prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.subscriber.findFirst({
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <AdminShell title="Subscribers">
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginBottom: 20 }}>
        <div className="stat-card">
          <div className="eyebrow">Total</div>
          <h2>{subscribers.length}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">Latest signup</div>
          <h2>{latestSubscriber ? formatDate(latestSubscriber.createdAt) : "None yet"}</h2>
        </div>
      </section>

      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="admin-table__actions">
          <div>
            <h3>Newsletter subscribers</h3>
            <p>Captured from the homepage signup form and stored in the application database.</p>
          </div>
          <Link href="/admin/subscribers/export" className="secondary-button">
            Export CSV
          </Link>
        </div>
      </section>

      <div className="admin-table">
        {subscribers.length ? (
          subscribers.map((subscriber) => (
            <div key={subscriber.id} className="admin-row panel admin-row--subscribers">
              <div>
                <h3>{subscriber.email}</h3>
                <div className="admin-table__meta">
                  <span>Joined {formatDate(subscriber.createdAt)}</span>
                </div>
              </div>
              <div>
                <a href={`mailto:${subscriber.email}`} className="secondary-button">
                  Email
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="panel">
            <p>No subscribers yet.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
