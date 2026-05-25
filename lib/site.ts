export const siteConfig = {
  name: "Zenmora Co.",
  description: "Warm, minimal interior inspiration with a lightweight built-in CMS.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zenmora-blog.vercel.app"
};

export function getSiteUrl(path = "") {
  return new URL(path, siteConfig.url).toString();
}
