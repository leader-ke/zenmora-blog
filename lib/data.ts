import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteContent = cache(async () => {
  return prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  });
});

export const getCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
});

export const getExploreCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    take: 4,
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 1
      }
    }
  });
});

export const getFeaturedPost = cache(async () => {
  return prisma.post.findFirst({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ publishedAt: "desc" }]
  });
});

export const getLatestPosts = cache(async () => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", latest: true },
    orderBy: [{ publishedAt: "desc" }],
    take: 4,
    include: {
      category: true
    }
  });
});

export const getPublishedPosts = cache(async () => {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }],
    include: {
      category: true
    }
  });
});

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true
    }
  });
});

export const getPostsByCategory = cache(async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }]
      }
    }
  });

  return category;
});
