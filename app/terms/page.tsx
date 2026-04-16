import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function TermsPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="article-shell">
          <div className="eyebrow">Terms</div>
          <h2>Terms placeholder</h2>
          <p>Update this page before launch with your final site terms and any affiliate disclosure language.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
