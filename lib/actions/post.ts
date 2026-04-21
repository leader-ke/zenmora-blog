"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";
import { buildUnsubscribeUrl, sendEmail } from "@/lib/email";
import { saveUploadedFile } from "@/lib/uploads";
import { slugify } from "@/lib/utils";

const POST_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
} as const;

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

export async function savePostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const status = getString(formData, "status") === POST_STATUS.PUBLISHED ? POST_STATUS.PUBLISHED : POST_STATUS.DRAFT;
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
    publishedAt: status === POST_STATUS.PUBLISHED ? existing?.publishedAt ?? new Date() : null
  };

  const post = id
    ? await prisma.post.update({
        where: { id },
        data: payload
      })
    : await prisma.post.create({
        data: payload
      });

  if (status === POST_STATUS.PUBLISHED && shouldNotifySubscribers) {
    const subscribers = await prisma.subscriber.findMany({
      where: { status: "SUBSCRIBED" },
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
