import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Zenmora Co. for collaborations, editorial questions, and project inquiries."
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="contact-grid">
          <div className="article-shell">
            <div className="eyebrow">{content.contactEyebrow}</div>
            <h2>{content.contactTitle}</h2>
            <p>{content.contactBody}</p>
            <div className="panel panel--editorial" style={{ marginTop: 24 }}>
              <div className="eyebrow">{content.contactScopeTitle}</div>
              <p style={{ margin: 0 }}>{content.contactScopeBody}</p>
            </div>
          </div>
          <ContactForm
            eyebrow={content.contactFormEyebrow}
            successMessage={content.contactSuccess}
            title={content.contactFormTitle}
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
