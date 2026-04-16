import Link from "next/link";
import { getSiteContent } from "@/lib/data";

export async function SiteFooter() {
  const siteContent = await getSiteContent();

  return (
    <footer className="site-shell footer">
      <div>
        <div className="brandmark brandmark--small">{siteContent.siteTitle}</div>
        <p>{siteContent.footerNote}</p>
      </div>
      <div className="footer__links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
