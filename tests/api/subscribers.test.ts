import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubscriberStatus } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscriber: {
      findUnique: vi.fn(),
      upsert: vi.fn()
    }
  }
}));

vi.mock("@/lib/email", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/email")>();
  return { ...actual, sendEmail: vi.fn().mockResolvedValue({ delivered: true, skipped: false }) };
});

import { POST } from "@/app/api/subscribers/route";
import { prisma } from "@/lib/prisma";

const mockSubscriber = {
  id: "sub-1",
  email: "user@example.com",
  status: SubscriberStatus.SUBSCRIBED,
  unsubscribeToken: "token-abc",
  subscribedAt: new Date(),
  unsubscribedAt: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

function makeRequest(body: object) {
  return new Request("http://localhost/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/subscribers", () => {
  it("returns 400 for an empty email", async () => {
    const res = await POST(makeRequest({ email: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest({ email: "notanemail" }));
    expect(res.status).toBe(400);
  });

  it('returns status "subscribed" for a new subscriber', async () => {
    vi.mocked(prisma.subscriber.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.subscriber.upsert).mockResolvedValue(mockSubscriber);
    const res = await POST(makeRequest({ email: "new@example.com" }));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe("subscribed");
  });

  it('returns status "exists" when email is already subscribed', async () => {
    vi.mocked(prisma.subscriber.findUnique).mockResolvedValue(mockSubscriber);
    vi.mocked(prisma.subscriber.upsert).mockResolvedValue(mockSubscriber);
    const res = await POST(makeRequest({ email: "user@example.com" }));
    const body = await res.json();
    expect(body.status).toBe("exists");
  });

  it("stores the email lowercased", async () => {
    vi.mocked(prisma.subscriber.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.subscriber.upsert).mockResolvedValue(mockSubscriber);
    await POST(makeRequest({ email: "USER@EXAMPLE.COM" }));
    expect(prisma.subscriber.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "user@example.com" } })
    );
  });
});
