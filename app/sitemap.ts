import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.category.findMany({
      select: { slug: true, updatedAt: true }
    })
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: getSiteUrl("/"), lastModified: new Date() },
    { url: getSiteUrl("/about"), lastModified: new Date() },
    { url: getSiteUrl("/blog"), lastModified: new Date() },
    { url: getSiteUrl("/contact"), lastModified: new Date() },
    { url: getSiteUrl("/privacy"), lastModified: new Date() },
    { url: getSiteUrl("/terms"), lastModified: new Date() }
  ];

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: getSiteUrl(`/category/${category.slug}`),
      lastModified: category.updatedAt
    })),
    ...posts.map((post) => ({
      url: getSiteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt
    }))
  ];
}
