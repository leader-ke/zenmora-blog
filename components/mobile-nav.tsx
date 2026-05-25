"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = { id: string; name: string; slug: string };

type Props = {
  siteTitle: string;
  categories: Category[];
};

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Categories" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav({ siteTitle, categories }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="mobile-nav-bar">
        <Link href="/" className="brandmark brandmark--small">{siteTitle}</Link>
        <button
          className="mobile-nav-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-menu__header">
              <span className="brandmark brandmark--small">{siteTitle}</span>
              <button
                className="mobile-nav-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav>
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {categories.length > 0 && (
              <>
                <div className="mobile-nav-divider" />
                <p className="mobile-nav-section-label">Explore</p>
                <nav>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="mobile-nav-link mobile-nav-link--category"
                      aria-current={pathname === `/category/${category.slug}` ? "page" : undefined}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
