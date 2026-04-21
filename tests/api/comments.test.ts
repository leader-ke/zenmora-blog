import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: { findUnique: vi.fn() },
    comment: { create: vi.fn(), count: vi.fn() }
  }
}));

import { POST } from "@/app/api/posts/[slug]/comments/route";
import { prisma } from "@/lib/prisma";

const mockPost = { id: "post-1", status: "PUBLISHED" };
const mockComment = {
  id: "comment-1",
  name: "Alice",
  content: "Great post!",
  createdAt: new Date("2024-01-01"),
  email: "alice@example.com",
  postId: "post-1"
};

function makeRequest(slug: string, body: object) {
  return new Request(`http://localhost/api/posts/${slug}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/posts/[slug]/comments", () => {
  it("returns 404 when post does not exist", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null as any);
    const res = await POST(
      makeRequest("unknown", { name: "Alice", email: "a@b.com", content: "Hello!" }),
      makeParams("unknown")
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unpublished post", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ ...mockPost, status: "DRAFT" } as any);
    const res = await POST(
      makeRequest("draft", { name: "Alice", email: "a@b.com", content: "Hello!" }),
      makeParams("draft")
    );
    expect(res.status).toBe(404);
  });

  it("returns 400 when name is missing", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
    const res = await POST(
      makeRequest("my-post", { name: "", email: "a@b.com", content: "Hello!" }),
      makeParams("my-post")
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid email", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
    const res = await POST(
      makeRequest("my-post", { name: "Alice", email: "notanemail", content: "Hello!" }),
      makeParams("my-post")
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when content is too short (< 3 chars)", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
    const res = await POST(
      makeRequest("my-post", { name: "Alice", email: "a@b.com", content: "Hi" }),
      makeParams("my-post")
    );
    expect(res.status).toBe(400);
  });

  it("creates a comment and returns it with count", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
    vi.mocked(prisma.comment.create).mockResolvedValue(mockComment as any);
    vi.mocked(prisma.comment.count).mockResolvedValue(3);

    const res = await POST(
      makeRequest("my-post", { name: "Alice", email: "a@b.com", content: "Great post!" }),
      makeParams("my-post")
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.comment.name).toBe("Alice");
    expect(body.comment.content).toBe("Great post!");
    expect(body.commentsCount).toBe(3);
  });

  it("stores the email lowercased", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
    vi.mocked(prisma.comment.create).mockResolvedValue(mockComment as any);
    vi.mocked(prisma.comment.count).mockResolvedValue(1);

    await POST(
      makeRequest("my-post", { name: "Alice", email: "ALICE@EXAMPLE.COM", content: "Hello there!" }),
      makeParams("my-post")
    );

    expect(prisma.comment.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ email: "alice@example.com" }) })
    );
  });
});
