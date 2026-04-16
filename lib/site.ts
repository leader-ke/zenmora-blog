export const siteConfig = {
  name: "Zenmora Co.",
  description: "Warm, minimal interior inspiration with a lightweight built-in CMS.",
  url: "https://zenmora-blog.pages.dev"
};

export function getSiteUrl(path = "") {
  return new URL(path, siteConfig.url).toString();
}
