import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { unsubscribeAction } from "@/lib/actions/subscriber";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Manage your Zenmora Co. subscription preferences."
};

export default async function UnsubscribePage({
  searchParams
}: {
  searchParams?: Promise<{ email?: string; token?: string; status?: string }>;
}) {
  const state = await searchParams;

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="article-shell" style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="eyebrow">Email Preferences</div>
          <h2>Manage your subscription</h2>
          <p>Use the button below to stop receiving Zenmora Co. emails for this address.</p>

          {state?.status === "success" ? <div className="status-note">You have been unsubscribed.</div> : null}
          {state?.status === "invalid" ? <div className="status-note">This unsubscribe link is invalid or has expired.</div> : null}

          {state?.status !== "success" ? (
            <form action={unsubscribeAction} className="editor-form" style={{ marginTop: 18 }}>
              <input type="hidden" name="email" value={state?.email ?? ""} />
              <input type="hidden" name="token" value={state?.token ?? ""} />
              <label>
                Email
                <input value={state?.email ?? ""} readOnly />
              </label>
              <button type="submit" className="primary-button">
                Unsubscribe
              </button>
            </form>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
