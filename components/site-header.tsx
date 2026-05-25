import Link from "next/link";
import { getCategories, getSiteContent } from "@/lib/data";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";

export async function SiteHeader() {
  const [categories, siteContent] = await Promise.all([getCategories(), getSiteContent()]);

  return (
    <header className="site-shell site-header">
      <MobileNav siteTitle={siteContent.siteTitle} categories={categories} />
      <nav className="top-nav" aria-label="Main navigation">
        <div className="top-nav__links">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/blog">Categories</NavLink>
        </div>
        <Link href="/" className="brandmark">
          {siteContent.siteTitle}
        </Link>
        <div className="top-nav__links top-nav__links--end">
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </nav>
      <div className="sub-nav">
        {categories.map((category) => (
          <NavLink key={category.id} href={`/category/${category.slug}`}>
            {category.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
