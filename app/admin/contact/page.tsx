import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { saveHomepageAction } from "@/lib/actions/admin";
import { getSiteContent } from "@/lib/data";

export default async function AdminContactPage({
  searchParams
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const [content, params] = await Promise.all([getSiteContent(), searchParams]);

  return (
    <AdminShell title="Contact Page">
      {params?.saved ? <div className="status-note" style={{ marginBottom: 18 }}>Contact page settings saved.</div> : null}
      <form action={saveHomepageAction} className="editor-form panel">
        <input type="hidden" name="returnTo" value="/admin/contact" />
        <div className="input-row">
          <label>
            Contact eyebrow
            <input name="contactEyebrow" defaultValue={content.contactEyebrow} required />
          </label>
          <label>
            Contact title
            <input name="contactTitle" defaultValue={content.contactTitle} required />
          </label>
        </div>
        <label>
          Contact intro
          <textarea name="contactBody" defaultValue={content.contactBody} required />
        </label>
        <div className="input-row">
          <label>
            Scope title
            <input name="contactScopeTitle" defaultValue={content.contactScopeTitle} required />
          </label>
          <label>
            Form eyebrow
            <input name="contactFormEyebrow" defaultValue={content.contactFormEyebrow} required />
          </label>
        </div>
        <label>
          Scope body
          <textarea name="contactScopeBody" defaultValue={content.contactScopeBody} required />
        </label>
        <div className="input-row">
          <label>
            Form title
            <input name="contactFormTitle" defaultValue={content.contactFormTitle} required />
          </label>
          <label>
            Success message
            <input name="contactSuccess" defaultValue={content.contactSuccess} required />
          </label>
        </div>

        <input type="hidden" name="siteTitle" defaultValue={content.siteTitle} />
        <input type="hidden" name="siteTagline" defaultValue={content.siteTagline} />
        <input type="hidden" name="heroTitle" defaultValue={content.heroTitle} />
        <input type="hidden" name="heroSubtitle" defaultValue={content.heroSubtitle} />
        <input type="hidden" name="heroCtaLabel" defaultValue={content.heroCtaLabel} />
        <input type="hidden" name="heroCtaHref" defaultValue={content.heroCtaHref} />
        <input type="hidden" name="heroImage" defaultValue={content.heroImage} />
        <input type="hidden" name="heroImageAlt" defaultValue={content.heroImageAlt} />
        <input type="hidden" name="trendingTitle" defaultValue={content.trendingTitle} />
        <input type="hidden" name="trendingBody" defaultValue={content.trendingBody} />
        <input type="hidden" name="trendingCtaLabel" defaultValue={content.trendingCtaLabel} />
        <input type="hidden" name="trendingCtaHref" defaultValue={content.trendingCtaHref} />
        <input type="hidden" name="trendingImage" defaultValue={content.trendingImage} />
        <input type="hidden" name="newsletterTitle" defaultValue={content.newsletterTitle} />
        <input type="hidden" name="newsletterBody" defaultValue={content.newsletterBody} />
        <input type="hidden" name="newsletterPlaceholder" defaultValue={content.newsletterPlaceholder} />
        <input type="hidden" name="newsletterButtonLabel" defaultValue={content.newsletterButtonLabel} />
        <input type="hidden" name="newsletterSuccess" defaultValue={content.newsletterSuccess} />
        <input type="hidden" name="footerNote" defaultValue={content.footerNote} />

        <button type="submit" className="primary-button">
          Save contact page
        </button>
      </form>
    </AdminShell>
  );
}
