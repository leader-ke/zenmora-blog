"use client";

import { useState } from "react";

type HomepageContent = {
  footerNote: string;
  heroCtaHref: string;
  heroCtaLabel: string;
  heroImage: string;
  heroImageAlt: string;
  heroSubtitle: string;
  heroTitle: string;
  newsletterBody: string;
  newsletterButtonLabel: string;
  newsletterPlaceholder: string;
  newsletterSuccess: string;
  newsletterTitle: string;
  siteTagline: string;
  siteTitle: string;
  trendingBody: string;
  trendingCtaHref: string;
  trendingCtaLabel: string;
  trendingImage: string;
  trendingTitle: string;
};

export function AdminHomepageForm({ content }: { content: HomepageContent }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        setStatus(result.error || "Homepage save failed.");
        return;
      }

      setStatus("Homepage settings saved.");
    } catch {
      setStatus("Homepage save failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {status ? <div className="status-note" style={{ marginBottom: 18 }}>{status}</div> : null}
      <form onSubmit={handleSubmit} className="editor-form panel">
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
            Hero image upload
            <input type="file" name="heroImageFile" accept="image/*" />
          </label>
        </div>
        <div className="input-row">
          <label>
            Hero image alt
            <input name="heroImageAlt" defaultValue={content.heroImageAlt} required />
          </label>
          <label>
            Trending image path
            <input name="trendingImage" defaultValue={content.trendingImage} required />
          </label>
        </div>
        <div className="input-row">
          <label>
            Trending title
            <input name="trendingTitle" defaultValue={content.trendingTitle} required />
          </label>
          <label>
            Trending image upload
            <input type="file" name="trendingImageFile" accept="image/*" />
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
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          Save homepage settings
        </button>
      </form>
    </>
  );
}
