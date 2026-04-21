"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

export async function saveHomepageAction(formData: FormData) {
  await requireAdmin();
  const returnTo = getString(formData, "returnTo") || "/admin/homepage";

  try {
    const heroImageFile = getFile(formData, "heroImageFile");
    const trendingImageFile = getFile(formData, "trendingImageFile");
    const uploadedHeroImage = await saveUploadedFile(heroImageFile, "homepage");
    const uploadedTrendingImage = await saveUploadedFile(trendingImageFile, "homepage");

    await prisma.siteContent.upsert({
      where: { id: 1 },
      update: {
        siteTitle: getString(formData, "siteTitle"),
        siteTagline: getString(formData, "siteTagline"),
        heroTitle: getString(formData, "heroTitle"),
        heroSubtitle: getString(formData, "heroSubtitle"),
        heroCtaLabel: getString(formData, "heroCtaLabel"),
        heroCtaHref: getString(formData, "heroCtaHref"),
        heroImage: uploadedHeroImage?.relativePath || getString(formData, "heroImage"),
        heroImageAlt: getString(formData, "heroImageAlt"),
        trendingTitle: getString(formData, "trendingTitle"),
        trendingBody: getString(formData, "trendingBody"),
        trendingCtaLabel: getString(formData, "trendingCtaLabel"),
        trendingCtaHref: getString(formData, "trendingCtaHref"),
        trendingImage: uploadedTrendingImage?.relativePath || getString(formData, "trendingImage"),
        newsletterTitle: getString(formData, "newsletterTitle"),
      newsletterBody: getString(formData, "newsletterBody"),
      newsletterPlaceholder: getString(formData, "newsletterPlaceholder"),
      newsletterButtonLabel: getString(formData, "newsletterButtonLabel"),
      newsletterSuccess: getString(formData, "newsletterSuccess"),
      contactEyebrow: getString(formData, "contactEyebrow"),
      contactTitle: getString(formData, "contactTitle"),
      contactBody: getString(formData, "contactBody"),
      contactScopeTitle: getString(formData, "contactScopeTitle"),
      contactScopeBody: getString(formData, "contactScopeBody"),
      contactFormEyebrow: getString(formData, "contactFormEyebrow"),
      contactFormTitle: getString(formData, "contactFormTitle"),
      contactSuccess: getString(formData, "contactSuccess"),
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
        heroImage: uploadedHeroImage?.relativePath || getString(formData, "heroImage"),
        heroImageAlt: getString(formData, "heroImageAlt"),
        trendingTitle: getString(formData, "trendingTitle"),
        trendingBody: getString(formData, "trendingBody"),
        trendingCtaLabel: getString(formData, "trendingCtaLabel"),
        trendingCtaHref: getString(formData, "trendingCtaHref"),
        trendingImage: uploadedTrendingImage?.relativePath || getString(formData, "trendingImage"),
        newsletterTitle: getString(formData, "newsletterTitle"),
      newsletterBody: getString(formData, "newsletterBody"),
      newsletterPlaceholder: getString(formData, "newsletterPlaceholder"),
      newsletterButtonLabel: getString(formData, "newsletterButtonLabel"),
      newsletterSuccess: getString(formData, "newsletterSuccess"),
      contactEyebrow: getString(formData, "contactEyebrow"),
      contactTitle: getString(formData, "contactTitle"),
      contactBody: getString(formData, "contactBody"),
      contactScopeTitle: getString(formData, "contactScopeTitle"),
      contactScopeBody: getString(formData, "contactScopeBody"),
      contactFormEyebrow: getString(formData, "contactFormEyebrow"),
      contactFormTitle: getString(formData, "contactFormTitle"),
      contactSuccess: getString(formData, "contactSuccess"),
      footerNote: getString(formData, "footerNote")
    }
    });
  } catch (error) {
    console.error("Homepage save failed", error);
    redirect("/admin/homepage?error=upload");
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/contact");
  redirect(`${returnTo}?saved=1`);
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

export async function saveShopItemAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const slug = slugify(getString(formData, "slug") || name);

  const payload = {
    name,
    slug,
    price: getString(formData, "price"),
    href: getString(formData, "href"),
    retailer: getString(formData, "retailer") || null,
    image: getString(formData, "image"),
    imageAlt: getString(formData, "imageAlt"),
    featured: getBoolean(formData, "featured"),
    active: getBoolean(formData, "active"),
    sortOrder: Number(getString(formData, "sortOrder") || "0")
  };

  if (id) {
    await prisma.shopItem.update({
      where: { id },
      data: payload
    });
  } else {
    await prisma.shopItem.create({
      data: payload
    });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/shop");
  redirect("/admin/shop?saved=1");
}

export async function deleteShopItemAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  await prisma.shopItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/shop");
  redirect("/admin/shop?deleted=1");
}
