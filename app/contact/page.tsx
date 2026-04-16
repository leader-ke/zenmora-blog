import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zenmora Co. for collaborations, editorial questions, and project inquiries."
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="article-shell">
          <div className="eyebrow">Contact</div>
          <h2>Collaborations and questions</h2>
          <p>Replace this copy with your preferred contact details, Instagram handle, or newsletter contact address.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
