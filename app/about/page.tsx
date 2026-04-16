import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="site-shell section">
        <section className="article-shell">
          <div className="eyebrow">About Zenmora Co.</div>
          <h2>Warm interiors with room to breathe.</h2>
          <p>
            Zenmora Co. is a personal editorial project focused on soft-neutral spaces, practical styling, and calm rooms
            that still feel alive. The site pairs a magazine-style front end with a built-in admin area so you can write,
            stage, and publish posts without touching code.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
