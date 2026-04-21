import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactMessage: { create: vi.fn() }
  }
}));

import { POST } from "@/app/api/contact/route";
import { prisma } from "@/lib/prisma";

const validPayload = {
  name: "Alice",
  email: "alice@example.com",
  subject: "Hello there",
  message: "This is a test message that is long enough to pass validation."
};

function makeRequest(body: object) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/contact", () => {
  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, name: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "notvalid" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when subject is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, subject: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is too short (< 10 chars)", async () => {
    const res = await POST(makeRequest({ ...validPayload, message: "Too short" }));
    expect(res.status).toBe(400);
  });

  it("creates a contact message and returns ok", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({} as any);
    const res = await POST(makeRequest(validPayload));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it("saves the correct fields to the database", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({} as any);
    await POST(makeRequest(validPayload));
    expect(prisma.contactMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Alice",
          email: "alice@example.com",
          subject: "Hello there"
        })
      })
    );
  });
});
