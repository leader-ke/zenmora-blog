import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Read the Zenmora Co. privacy policy."
};

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="article-shell">
          <div className="eyebrow">Privacy</div>
          <h2>Privacy policy placeholder</h2>
          <p>Update this page before launch with your final privacy policy and subscriber data handling language.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
