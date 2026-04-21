import { describe, it, expect } from "vitest";
import { buildUnsubscribeUrl } from "@/lib/email";
import { siteConfig } from "@/lib/site";

describe("buildUnsubscribeUrl", () => {
  it("includes email as a query param", () => {
    const url = new URL(buildUnsubscribeUrl("user@example.com", "abc123"));
    expect(url.searchParams.get("email")).toBe("user@example.com");
  });
  it("includes token as a query param", () => {
    const url = new URL(buildUnsubscribeUrl("user@example.com", "abc123"));
    expect(url.searchParams.get("token")).toBe("abc123");
  });
  it("points to the /unsubscribe path on the site origin", () => {
    const url = new URL(buildUnsubscribeUrl("user@example.com", "abc123"));
    expect(url.pathname).toBe("/unsubscribe");
    expect(url.origin).toBe(new URL(siteConfig.url).origin);
  });
  it("correctly encodes special characters in email", () => {
    const url = new URL(buildUnsubscribeUrl("user+tag@example.com", "token"));
    expect(url.searchParams.get("email")).toBe("user+tag@example.com");
  });
});
