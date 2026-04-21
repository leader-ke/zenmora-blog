import { AdminHomepageForm } from "@/components/admin-homepage-form";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getSiteContent } from "@/lib/data";

export default async function AdminHomepagePage() {
  await requireAdmin();
  const content = await getSiteContent();

  return (
    <AdminShell title="Homepage Content">
      <AdminHomepageForm content={content} />
    </AdminShell>
  );
}
