import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/messages", label: "Messages" }
];

export function AdminShell({ title, children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="brandmark brandmark--small">
          Zenmora Co.
        </Link>
        <nav className="admin-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button className="secondary-button" type="submit">
            Sign out
          </button>
        </form>
      </aside>
      <main className="admin-content">
        <header className="admin-content__header">
          <h1>{title}</h1>
          <Link href="/" className="secondary-button">
            View site
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
