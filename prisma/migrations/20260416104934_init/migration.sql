-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "heroLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "latest" BOOLEAN NOT NULL DEFAULT false,
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "roomSort" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteTitle" TEXT NOT NULL DEFAULT 'Zenmora Co.',
    "siteTagline" TEXT NOT NULL DEFAULT 'Creating calm, beautiful spaces',
    "heroTitle" TEXT NOT NULL DEFAULT 'Zenmora Co.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Creating calm, beautiful spaces',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'Explore Ideas',
    "heroCtaHref" TEXT NOT NULL DEFAULT '/blog',
    "heroImage" TEXT NOT NULL DEFAULT '/images/hero-room.svg',
    "heroImageAlt" TEXT NOT NULL DEFAULT 'Soft neutral living room',
    "trendingTitle" TEXT NOT NULL DEFAULT 'Trending Now',
    "trendingBody" TEXT NOT NULL DEFAULT 'At Zenmora Co., we believe your home should feel as beautiful as it looks. We share modern, cozy, and budget-friendly ideas to help you create a space you truly love.',
    "trendingCtaLabel" TEXT NOT NULL DEFAULT 'Read More',
    "trendingCtaHref" TEXT NOT NULL DEFAULT '/blog',
    "trendingImage" TEXT NOT NULL DEFAULT '/images/trending-room.svg',
    "newsletterTitle" TEXT NOT NULL DEFAULT 'Join Zenmora Co.',
    "newsletterBody" TEXT NOT NULL DEFAULT 'Get weekly home inspiration and decor ideas.',
    "newsletterPlaceholder" TEXT NOT NULL DEFAULT 'Enter your email',
    "newsletterButtonLabel" TEXT NOT NULL DEFAULT 'Subscribe',
    "newsletterSuccess" TEXT NOT NULL DEFAULT 'Thanks for subscribing.',
    "footerNote" TEXT NOT NULL DEFAULT 'Calm interiors, thoughtful living.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
