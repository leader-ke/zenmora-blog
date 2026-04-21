import { describe, it, expect } from "vitest";
import {
  slugify,
  formatDate,
  excerptParagraphs,
  splitPostTags,
  parsePostContent,
  isRichTextContent,
  sanitizePostHtml
} from "@/lib/utils";

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("collapses multiple non-alphanumeric chars into one hyphen", () => {
    expect(slugify("foo  --  bar")).toBe("foo-bar");
  });
  it("strips leading and trailing hyphens", () => {
    expect(slugify("  -hello- ")).toBe("hello");
  });
  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
  it("preserves numbers", () => {
    expect(slugify("Room 101")).toBe("room-101");
  });
});

describe("formatDate", () => {
  it('returns "Draft" for null', () => {
    expect(formatDate(null)).toBe("Draft");
  });
  it('returns "Draft" for undefined', () => {
    expect(formatDate(undefined)).toBe("Draft");
  });
  it("formats a Date object with month and year", () => {
    const result = formatDate(new Date("2024-01-15T00:00:00Z"));
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2024/);
  });
  it("formats a date string", () => {
    const result = formatDate("2024-06-01");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2024/);
  });
});

describe("excerptParagraphs", () => {
  it("splits on single newlines", () => {
    expect(excerptParagraphs("foo\nbar")).toEqual(["foo", "bar"]);
  });
  it("filters out empty lines", () => {
    expect(excerptParagraphs("foo\n\n\nbar")).toEqual(["foo", "bar"]);
  });
  it("trims whitespace from each paragraph", () => {
    expect(excerptParagraphs("  hello  \n  world  ")).toEqual(["hello", "world"]);
  });
  it("returns empty array for blank string", () => {
    expect(excerptParagraphs("")).toEqual([]);
  });
});

describe("splitPostTags", () => {
  it("splits comma-separated tags", () => {
    expect(splitPostTags("interiors,design,minimal")).toEqual(["interiors", "design", "minimal"]);
  });
  it("trims whitespace around each tag", () => {
    expect(splitPostTags(" a , b , c ")).toEqual(["a", "b", "c"]);
  });
  it("filters empty entries from double commas", () => {
    expect(splitPostTags("a,,b")).toEqual(["a", "b"]);
  });
  it("returns empty array for null", () => {
    expect(splitPostTags(null)).toEqual([]);
  });
  it("returns empty array for undefined", () => {
    expect(splitPostTags(undefined)).toEqual([]);
  });
});

describe("parsePostContent", () => {
  it("parses a heading block", () => {
    expect(parsePostContent("## My Heading")).toEqual([{ type: "heading", text: "My Heading" }]);
  });
  it("parses a paragraph block", () => {
    expect(parsePostContent("Some plain text")).toEqual([{ type: "paragraph", text: "Some plain text" }]);
  });
  it("parses an image block", () => {
    expect(parsePostContent("![alt text](https://example.com/img.jpg)")).toEqual([
      { type: "image", alt: "alt text", url: "https://example.com/img.jpg" }
    ]);
  });
  it("parses a file block", () => {
    expect(parsePostContent("[file:Resume](https://example.com/resume.pdf)")).toEqual([
      { type: "file", label: "Resume", url: "https://example.com/resume.pdf" }
    ]);
  });
  it("parses a list block", () => {
    expect(parsePostContent("- item one\n- item two")).toEqual([
      { type: "list", items: ["item one", "item two"] }
    ]);
  });
  it("parses a quote block", () => {
    expect(parsePostContent("> line one\n> line two")).toEqual([
      { type: "quote", text: "line one line two" }
    ]);
  });
  it("parses multiple blocks separated by blank lines", () => {
    const result = parsePostContent("## Heading\n\nParagraph text");
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("heading");
    expect(result[1].type).toBe("paragraph");
  });
  it("returns empty array for empty string", () => {
    expect(parsePostContent("")).toEqual([]);
  });
});

describe("isRichTextContent", () => {
  it("returns true for paragraph HTML", () => {
    expect(isRichTextContent("<p>Hello</p>")).toBe(true);
  });
  it("returns true for heading HTML", () => {
    expect(isRichTextContent("<h2>Title</h2>")).toBe(true);
  });
  it("returns true for inline HTML", () => {
    expect(isRichTextContent("<strong>bold</strong>")).toBe(true);
  });
  it("returns false for plain text", () => {
    expect(isRichTextContent("Just plain text")).toBe(false);
  });
  it("returns false for markdown heading", () => {
    expect(isRichTextContent("## Markdown heading")).toBe(false);
  });
});

describe("sanitizePostHtml", () => {
  it("allows safe tags through", () => {
    const result = sanitizePostHtml("<p>Hello <strong>world</strong></p>");
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
  });
  it("strips disallowed script tags", () => {
    const result = sanitizePostHtml("<p>Safe</p><script>evil()</script>");
    expect(result).not.toContain("<script>");
    expect(result).toContain("<p>");
  });
  it("adds rel=noreferrer and target=_blank to links", () => {
    const result = sanitizePostHtml('<a href="https://example.com">link</a>');
    expect(result).toContain('rel="noreferrer"');
    expect(result).toContain('target="_blank"');
  });
  it("strips javascript: hrefs", () => {
    const result = sanitizePostHtml('<a href="javascript:evil()">click</a>');
    expect(result).not.toContain("javascript:");
  });
});
