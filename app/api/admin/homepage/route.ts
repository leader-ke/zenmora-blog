import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/uploads";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
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
        footerNote: getString(formData, "footerNote")
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Homepage save failed", error);
    return NextResponse.json(
      { error: "Homepage save failed. Check that the Supabase bucket exists and the storage credentials are valid." },
      { status: 500 }
    );
  }
}
