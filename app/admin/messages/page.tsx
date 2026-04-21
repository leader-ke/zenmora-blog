import { AdminShell } from "@/components/admin-shell";
import { markContactMessageReviewedAction } from "@/lib/actions/contact";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminMessagesPage() {
  await requireAdmin();

  const [messages, newCount] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.contactMessage.count({
      where: { status: "NEW" }
    })
  ]);

  return (
    <AdminShell title="Messages">
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card">
          <div className="eyebrow">Inbox</div>
          <h2>{messages.length}</h2>
        </div>
        <div className="stat-card">
          <div className="eyebrow">New</div>
          <h2>{newCount}</h2>
        </div>
      </section>

      <div className="admin-table">
        {messages.length ? (
          messages.map((message) => (
            <div key={message.id} className="panel" style={{ display: "grid", gap: 14 }}>
              <div className="admin-table__actions">
                <div>
                  <h3>{message.subject}</h3>
                  <div className="admin-table__meta">
                    <span>{message.name}</span>
                    <span>{message.email}</span>
                    <span>{formatDate(message.createdAt)}</span>
                    <span>{message.status}</span>
                  </div>
                </div>
                {message.status === "NEW" ? (
                  <form action={markContactMessageReviewedAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="secondary-button">
                      Mark reviewed
                    </button>
                  </form>
                ) : null}
              </div>
              <p style={{ margin: 0 }}>{message.message}</p>
            </div>
          ))
        ) : (
          <div className="panel">
            <p>No contact messages yet.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
