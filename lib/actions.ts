"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostStatus } from "@prisma/client";
import { clearSession, createSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function loginAction(formData: FormData) {
  const password = getString(formData, "password");

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect("/admin/login?error=invalid-password");
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveHomepageAction(formData: FormData) {
  await requireAdmin();
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {
      siteTitle: getString(formData, "siteTitle"),
      siteTagline: getString(formData, "siteTagline"),
      heroTitle: getString(formData, "heroTitle"),
      heroSubtitle: getString(formData, "heroSubtitle"),
      heroCtaLabel: getString(formData, "heroCtaLabel"),
      heroCtaHref: getString(formData, "heroCtaHref"),
      heroImage: getString(formData, "heroImage"),
      heroImageAlt: getString(formData, "heroImageAlt"),
      trendingTitle: getString(formData, "trendingTitle"),
      trendingBody: getString(formData, "trendingBody"),
      trendingCtaLabel: getString(formData, "trendingCtaLabel"),
      trendingCtaHref: getString(formData, "trendingCtaHref"),
      trendingImage: getString(formData, "trendingImage"),
      newsletterTitle: getString(formData, "newsletterTitle"),
      newsletterBody: getString(formData, "newsletterBody"),
      newsletterPlaceholder: getString(formData, "newsletterPlaceholder"),
      newsletterButtonLabel: getString(formData, "newsletterButtonLabel"),
      newsletterSuccess: getString(formData, "newsletterSuccess"),
      footerNote: getString(formData, "footerNote")
    },
    create: {
      id: 1,
      siteTitle: getString(formData, "siteTitle"),
      siteTagline: getString(formData, "siteTagline"),
      heroTitle: getString(formData, "heroTitle"),
      heroSubtitle: getString(formData, "heroSubtitle"),
      heroCtaLabel: getString(formData, "heroCtaLabel"),
      heroCtaHref: getString(formData, "heroCtaHref"),
      heroImage: getString(formData, "heroImage"),
      heroImageAlt: getString(formData, "heroImageAlt"),
      trendingTitle: getString(formData, "trendingTitle"),
      trendingBody: getString(formData, "trendingBody"),
      trendingCtaLabel: getString(formData, "trendingCtaLabel"),
      trendingCtaHref: getString(formData, "trendingCtaHref"),
      trendingImage: getString(formData, "trendingImage"),
      newsletterTitle: getString(formData, "newsletterTitle"),
      newsletterBody: getString(formData, "newsletterBody"),
      newsletterPlaceholder: getString(formData, "newsletterPlaceholder"),
      newsletterButtonLabel: getString(formData, "newsletterButtonLabel"),
      newsletterSuccess: getString(formData, "newsletterSuccess"),
      footerNote: getString(formData, "footerNote")
    }
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?saved=1");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const slug = slugify(getString(formData, "slug") || name);

  const payload = {
    name,
    slug,
    description: getString(formData, "description"),
    heroLabel: getString(formData, "heroLabel")
  };

  if (id) {
    await prisma.category.update({
      where: { id },
      data: payload
    });
  } else {
    await prisma.category.create({ data: payload });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?deleted=1");
}

export async function savePostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const status = getString(formData, "status") === "PUBLISHED" ? PostStatus.PUBLISHED : PostStatus.DRAFT;
  const existing = id ? await prisma.post.findUnique({ where: { id } }) : null;

  const payload = {
    title,
    slug,
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    categoryId: getString(formData, "categoryId"),
    heroImage: getString(formData, "heroImage"),
    heroAlt: getString(formData, "heroAlt"),
    featured: getBoolean(formData, "featured"),
    latest: getBoolean(formData, "latest"),
    status,
    publishedAt:
      status === PostStatus.PUBLISHED
        ? existing?.publishedAt ?? new Date()
        : null
  };

  if (id) {
    await prisma.post.update({
      where: { id },
      data: payload
    });
  } else {
    await prisma.post.create({
      data: payload
    });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin/posts?saved=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin/posts?deleted=1");
}

export async function subscribeAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/?subscribed=invalid");
  }

  const existing = await prisma.subscriber.findUnique({
    where: { email }
  });

  await prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email }
  });

  redirect(existing ? "/?subscribed=exists" : "/?subscribed=1");
}
