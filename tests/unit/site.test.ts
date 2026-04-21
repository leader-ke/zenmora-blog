import { describe, it, expect } from "vitest";
import { getSiteUrl, siteConfig } from "@/lib/site";

describe("getSiteUrl", () => {
  it("builds a full URL from a path", () => {
    expect(getSiteUrl("/blog")).toBe(`${siteConfig.url}/blog`);
  });
  it("handles a path without a leading slash", () => {
    expect(getSiteUrl("about")).toBe(`${siteConfig.url}/about`);
  });
  it("returns the base URL for an empty path", () => {
    expect(getSiteUrl("")).toBe(`${siteConfig.url}/`);
  });
  it("preserves query strings", () => {
    expect(getSiteUrl("/search?q=sofa")).toBe(`${siteConfig.url}/search?q=sofa`);
  });
});
