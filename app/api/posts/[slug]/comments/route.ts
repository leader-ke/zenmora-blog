import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, status: true }
  });

  if (!post || post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const body = (await request.json()) as { name?: string; email?: string; content?: string };
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const content = String(body.content ?? "").trim();

  if (!name || !email.includes("@") || content.length < 3) {
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      postId: post.id,
      name,
      email,
      content
    },
    select: {
      id: true,
      name: true,
      content: true,
      createdAt: true
    }
  });

  const commentsCount = await prisma.comment.count({
    where: { postId: post.id }
  });

  return NextResponse.json({
    ok: true,
    comment: {
      ...comment,
      createdAt: comment.createdAt.toISOString()
    },
    commentsCount
  });
}
