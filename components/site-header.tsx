import Link from "next/link";
import { getCategories, getSiteContent } from "@/lib/data";

export async function SiteHeader() {
  const [categories, siteContent] = await Promise.all([getCategories(), getSiteContent()]);

  return (
    <header className="site-shell site-header">
      <nav className="top-nav" aria-label="Main navigation">
        <div className="top-nav__links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Categories</Link>
        </div>
        <Link href="/" className="brandmark">
          {siteContent.siteTitle}
        </Link>
        <div className="top-nav__links top-nav__links--end">
          <Link href="/shop">Shop</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
      <div className="sub-nav">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            {category.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
