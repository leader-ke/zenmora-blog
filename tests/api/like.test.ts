import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  }
}));

import { POST } from "@/app/api/posts/[slug]/like/route";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "zenmora-liked-posts";
const mockPost = { id: "post-1", likesCount: 5, status: "PUBLISHED" };

function makeRequest(slug: string, cookie = "") {
  return new Request(`http://localhost/api/posts/${slug}/like`, {
    method: "POST",
    headers: cookie ? { cookie } : {}
  });
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/posts/[slug]/like", () => {
  it("returns 404 when post does not exist", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null);
    const res = await POST(makeRequest("unknown"), makeParams("unknown"));
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unpublished post", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ ...mockPost, status: "DRAFT" });
    const res = await POST(makeRequest("draft-post"), makeParams("draft-post"));
    expect(res.status).toBe(404);
  });

  it("increments like count on first like", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost);
    vi.mocked(prisma.post.update).mockResolvedValue({ likesCount: 6 });
    const res = await POST(makeRequest("my-post"), makeParams("my-post"));
    const body = await res.json();
    expect(body.liked).toBe(true);
    expect(body.likesCount).toBe(6);
    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { likesCount: { increment: 1 } } })
    );
  });

  it("decrements like count when post is already liked (toggle off)", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost);
    vi.mocked(prisma.post.update).mockResolvedValue({ likesCount: 4 });
    const res = await POST(
      makeRequest("my-post", `${COOKIE_NAME}=${mockPost.id}`),
      makeParams("my-post")
    );
    const body = await res.json();
    expect(body.liked).toBe(false);
    expect(body.likesCount).toBe(4);
    expect(prisma.post.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { likesCount: { increment: -1 } } })
    );
  });

  it("sets the liked cookie after a first like", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost);
    vi.mocked(prisma.post.update).mockResolvedValue({ likesCount: 6 });
    const res = await POST(makeRequest("my-post"), makeParams("my-post"));
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain(COOKIE_NAME);
    expect(setCookie).toContain(mockPost.id);
  });

  it("removes post id from cookie when unliked", async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost);
    vi.mocked(prisma.post.update).mockResolvedValue({ likesCount: 4 });
    const res = await POST(
      makeRequest("my-post", `${COOKIE_NAME}=${mockPost.id}`),
      makeParams("my-post")
    );
    const setCookie = res.headers.get("set-cookie") ?? "";
    const cookieValue = setCookie.match(/zenmora-liked-posts=([^;]*)/)?.[1] ?? "";
    expect(cookieValue).not.toContain(mockPost.id);
  });
});
