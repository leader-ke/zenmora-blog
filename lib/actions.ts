"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContactMessageStatus, PostStatus, SubscriberStatus } from "@prisma/client";
import { clearSession, createSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";
import { buildUnsubscribeUrl, sendEmail } from "@/lib/email";
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

async function sendSubscriptionEmail(email: string, unsubscribeToken: string) {
  const unsubscribeUrl = buildUnsubscribeUrl(email, unsubscribeToken);

  try {
    await sendEmail({
      to: email,
      subject: "You are subscribed to Zenmora Co.",
      text: `Thanks for subscribing to Zenmora Co. You will receive new editorial updates here. Unsubscribe anytime: ${unsubscribeUrl}`,
      html: `<p>Thanks for subscribing to <strong>Zenmora Co.</strong>.</p><p>You will receive new editorial updates here.</p><p><a href="${unsubscribeUrl}">Unsubscribe</a> anytime.</p>`
    });
  } catch (error) {
    console.error("Subscription email failed", error);
  }
}

async function notifySubscribersAboutPost(post: { title: string; excerpt: string; slug: string }, subscribers: Array<{ email: string; unsubscribeToken: string }>) {
  const results = await Promise.allSettled(
    subscribers.map((subscriber) =>
      sendEmail({
        to: subscriber.email,
        subject: `New on Zenmora Co.: ${post.title}`,
        text: `${post.title}\n\n${post.excerpt}\n\nRead it here: ${getSiteUrl(`/blog/${post.slug}`)}\n\nUnsubscribe: ${buildUnsubscribeUrl(
          subscriber.email,
          subscriber.unsubscribeToken
        )}`,
        html: `<p><strong>${post.title}</strong></p><p>${post.excerpt}</p><p><a href="${getSiteUrl(`/blog/${post.slug}`)}">Read the full post</a></p><p><a href="${buildUnsubscribeUrl(
          subscriber.email,
          subscriber.unsubscribeToken
        )}">Unsubscribe</a></p>`
      })
    )
  );

  return results.filter((result) => result.status === "fulfilled" && result.value.delivered).length;
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
  const heroImageFile = getFile(formData, "heroImageFile");
  const attachmentFile = getFile(formData, "attachmentFile");
  const uploadedHeroImage = await saveUploadedFile(heroImageFile, "posts");
  const uploadedAttachment = await saveUploadedFile(attachmentFile, "attachments");
  const shouldNotifySubscribers = getBoolean(formData, "notifySubscribers");

  const payload = {
    title,
    slug,
    excerpt: getString(formData, "excerpt"),
    content: getString(formData, "content"),
    authorName: getString(formData, "authorName") || null,
    tags: getString(formData, "tags") || null,
    metaTitle: getString(formData, "metaTitle") || null,
    metaDescription: getString(formData, "metaDescription") || null,
    categoryId: getString(formData, "categoryId"),
    heroImage: uploadedHeroImage?.relativePath || getString(formData, "heroImage"),
    heroAlt: getString(formData, "heroAlt"),
    attachmentUrl: uploadedAttachment?.relativePath || getString(formData, "attachmentUrl") || null,
    attachmentName: uploadedAttachment?.fileName || getString(formData, "attachmentName") || null,
    featured: getBoolean(formData, "featured"),
    latest: getBoolean(formData, "latest"),
    status,
    publishedAt: status === PostStatus.PUBLISHED ? existing?.publishedAt ?? new Date() : null
  };

  const post = id
    ? await prisma.post.update({
        where: { id },
        data: payload
      })
    : await prisma.post.create({
        data: payload
      });

  if (status === PostStatus.PUBLISHED && shouldNotifySubscribers) {
    const subscribers = await prisma.subscriber.findMany({
      where: { status: SubscriberStatus.SUBSCRIBED },
      select: { email: true, unsubscribeToken: true }
    });

    if (subscribers.length) {
      const deliveredCount = await notifySubscribersAboutPost(post, subscribers);

      if (deliveredCount > 0) {
        await prisma.post.update({
          where: { id: post.id },
          data: { notifiedAt: new Date() }
        });
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${slug}`);

  if (existing?.slug && existing.slug !== slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }

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

export async function subscribeAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/?subscribed=invalid");
  }

  const existing = await prisma.subscriber.findUnique({
    where: { email }
  });

  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: {
      status: SubscriberStatus.SUBSCRIBED,
      subscribedAt: new Date(),
      unsubscribedAt: null
    },
    create: { email }
  });

  await sendSubscriptionEmail(subscriber.email, subscriber.unsubscribeToken);
  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  redirect(existing?.status === SubscriberStatus.SUBSCRIBED ? "/?subscribed=exists" : "/?subscribed=1");
}

export async function unsubscribeAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const token = getString(formData, "token");

  const subscriber = await prisma.subscriber.findUnique({
    where: { email }
  });

  if (!subscriber || subscriber.unsubscribeToken !== token) {
    redirect("/unsubscribe?status=invalid");
  }

  await prisma.subscriber.update({
    where: { email },
    data: {
      status: SubscriberStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date()
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  redirect("/unsubscribe?status=success");
}

export async function contactAction(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const subject = getString(formData, "subject");
  const message = getString(formData, "message");

  if (!name || !email.includes("@") || !subject || message.length < 10) {
    redirect("/contact?sent=invalid");
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      subject,
      message
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  redirect("/contact?sent=1");
}

export async function markContactMessageReviewedAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  await prisma.contactMessage.update({
    where: { id },
    data: { status: ContactMessageStatus.REVIEWED }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  redirect("/admin/messages?reviewed=1");
}

export async function likePostAction(formData: FormData) {
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");
  const store = await cookies();
  const likedPosts = new Set(
    String(store.get("zenmora-liked-posts")?.value ?? "")
      .split(",")
      .filter(Boolean)
  );

  if (likedPosts.has(postId)) {
    redirect(`/blog/${slug}?liked=exists#engagement`);
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: {
        increment: 1
      }
    }
  });

  likedPosts.add(postId);
  store.set("zenmora-liked-posts", [...likedPosts].join(","), {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect(`/blog/${slug}?liked=1#engagement`);
}

export async function commentAction(formData: FormData) {
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const content = getString(formData, "content");

  if (!name || !email.includes("@") || content.length < 3) {
    redirect(`/blog/${slug}?commented=invalid#comments`);
  }

  await prisma.comment.create({
    data: {
      postId,
      name,
      email,
      content
    }
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  redirect(`/blog/${slug}?commented=1#comments`);
}
