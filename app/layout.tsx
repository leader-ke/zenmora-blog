import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenmora Co.",
  description: "Warm, minimal interior inspiration with a lightweight built-in CMS."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
