import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { saveHomepageAction } from "@/lib/actions";
import { getSiteContent } from "@/lib/data";

export default async function AdminHomepagePage() {
  await requireAdmin();
  const content = await getSiteContent();

  return (
    <AdminShell title="Homepage Content">
      <form action={saveHomepageAction} className="editor-form panel">
        <div className="input-row">
          <label>
            Site title
            <input name="siteTitle" defaultValue={content.siteTitle} required />
          </label>
          <label>
            Site tagline
            <input name="siteTagline" defaultValue={content.siteTagline} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero title
            <input name="heroTitle" defaultValue={content.heroTitle} required />
          </label>
          <label>
            Hero subtitle
            <input name="heroSubtitle" defaultValue={content.heroSubtitle} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero CTA label
            <input name="heroCtaLabel" defaultValue={content.heroCtaLabel} required />
          </label>
          <label>
            Hero CTA href
            <input name="heroCtaHref" defaultValue={content.heroCtaHref} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero image path
            <input name="heroImage" defaultValue={content.heroImage} required />
          </label>
          <label>
            Hero image alt
            <input name="heroImageAlt" defaultValue={content.heroImageAlt} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Trending title
            <input name="trendingTitle" defaultValue={content.trendingTitle} required />
          </label>
          <label>
            Trending image path
            <input name="trendingImage" defaultValue={content.trendingImage} required />
          </label>
        </div>
        <label>
          Trending body
          <textarea name="trendingBody" defaultValue={content.trendingBody} required />
        </label>
        <div className="input-row">
          <label>
            Trending CTA label
            <input name="trendingCtaLabel" defaultValue={content.trendingCtaLabel} required />
          </label>
          <label>
            Trending CTA href
            <input name="trendingCtaHref" defaultValue={content.trendingCtaHref} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Newsletter title
            <input name="newsletterTitle" defaultValue={content.newsletterTitle} required />
          </label>
          <label>
            Newsletter button label
            <input name="newsletterButtonLabel" defaultValue={content.newsletterButtonLabel} required />
          </label>
        </div>
        <label>
          Newsletter body
          <textarea name="newsletterBody" defaultValue={content.newsletterBody} required />
        </label>
        <div className="input-row">
          <label>
            Newsletter placeholder
            <input name="newsletterPlaceholder" defaultValue={content.newsletterPlaceholder} required />
          </label>
          <label>
            Success message
            <input name="newsletterSuccess" defaultValue={content.newsletterSuccess} required />
          </label>
        </div>
        <label>
          Footer note
          <input name="footerNote" defaultValue={content.footerNote} required />
        </label>
        <button type="submit" className="primary-button">
          Save homepage settings
        </button>
      </form>
    </AdminShell>
  );
}
