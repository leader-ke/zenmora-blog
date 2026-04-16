import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const POSTS_PER_PAGE = 6;

const postCardInclude = {
  category: true
} as const;

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
    include: postCardInclude
  });
});

export const getShopItems = cache(async (options?: { take?: number; featuredOnly?: boolean }) => {
  const { take, featuredOnly } = options ?? {};

  return prisma.shopItem.findMany({
    where: {
      active: true,
      ...(featuredOnly ? { featured: true } : {})
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    ...(take ? { take } : {})
  });
});

export const getPublishedPosts = cache(async (page = 1, pageSize = POSTS_PER_PAGE) => {
  const safePage = Math.max(page, 1);
  const where = { status: "PUBLISHED" as const };
  const totalCount = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(safePage, totalPages);
  const skip = (currentPage - 1) * pageSize;
  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }],
    skip,
    take: pageSize,
    include: postCardInclude
  });

  return {
    posts,
    totalCount,
    page: currentPage,
    totalPages
  };
});

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true
    }
  });
});

export const getCategoryPageData = cache(async (slug: string, page = 1, pageSize = POSTS_PER_PAGE) => {
  const safePage = Math.max(page, 1);

  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return null;
  }

  const featuredPost = await prisma.post.findFirst({
    where: { status: "PUBLISHED", categoryId: category.id },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: postCardInclude
  });

  const where = {
    status: "PUBLISHED" as const,
    categoryId: category.id,
    ...(featuredPost ? { id: { not: featuredPost.id } } : {})
  };

  const totalCount = await prisma.post.count({
    where: { status: "PUBLISHED", categoryId: category.id }
  });

  const remainingCount = featuredPost ? Math.max(totalCount - 1, 0) : totalCount;
  const totalPages = Math.max(1, Math.ceil(remainingCount / pageSize));
  const currentPage = Math.min(safePage, totalPages);
  const skip = (currentPage - 1) * pageSize;

  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }],
    skip,
    take: pageSize,
    include: postCardInclude
  });

  return {
    category,
    featuredPost,
    posts,
    totalCount,
    page: currentPage,
    totalPages
  };
});
