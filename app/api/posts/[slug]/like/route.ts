import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "zenmora-liked-posts";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, likesCount: true, status: true }
  });

  if (!post || post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const likedPosts = new Set(
    String(request.headers.get("cookie") ?? "")
      .split("; ")
      .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
      ?.replace(`${COOKIE_NAME}=`, "")
      ?.split(",")
      .filter(Boolean) ?? []
  );

  const alreadyLiked = likedPosts.has(post.id);

  const updated = await prisma.post.update({
    where: { id: post.id },
    data: { likesCount: { increment: alreadyLiked ? -1 : 1 } },
    select: { likesCount: true }
  });

  if (alreadyLiked) {
    likedPosts.delete(post.id);
  } else {
    likedPosts.add(post.id);
  }

  const response = NextResponse.json({
    ok: true,
    liked: !alreadyLiked,
    likesCount: updated.likesCount
  });

  response.cookies.set(COOKIE_NAME, [...likedPosts].join(","), {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });

  return response;
}
