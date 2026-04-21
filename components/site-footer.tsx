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
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/admin/login">Admin</Link>
      </div>
      <p className="footer__legal">&copy; {new Date().getFullYear()} {siteContent.siteTitle}. All rights reserved.</p>
    </footer>
  );
}
