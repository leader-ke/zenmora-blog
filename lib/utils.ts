import sanitizeHtml from "sanitize-html";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function excerptParagraphs(content: string) {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function splitPostTags(tags: string | null | undefined) {
  return tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
}

export type PostContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; alt: string; url: string }
  | { type: "file"; label: string; url: string };

export function parsePostContent(content: string): PostContentBlock[] {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const imageMatch = block.match(/^!\[(.*)\]\((.+)\)$/);
    if (imageMatch) {
      return { type: "image", alt: imageMatch[1].trim(), url: imageMatch[2].trim() } satisfies PostContentBlock;
    }

    const fileMatch = block.match(/^\[file:(.*)\]\((.+)\)$/i);
    if (fileMatch) {
      return { type: "file", label: fileMatch[1].trim(), url: fileMatch[2].trim() } satisfies PostContentBlock;
    }

    if (block.startsWith("## ")) {
      return { type: "heading", text: block.replace(/^##\s+/, "").trim() } satisfies PostContentBlock;
    }

    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

    if (lines.every((line) => line.startsWith("- "))) {
      return { type: "list", items: lines.map((line) => line.replace(/^- /, "").trim()) } satisfies PostContentBlock;
    }

    if (lines.every((line) => line.startsWith("> "))) {
      return { type: "quote", text: lines.map((line) => line.replace(/^> /, "").trim()).join(" ") } satisfies PostContentBlock;
    }

    return { type: "paragraph", text: block.replace(/\n+/g, " ").trim() } satisfies PostContentBlock;
  });
}

export function isRichTextContent(content: string) {
  return /<(p|h2|blockquote|ul|ol|li|strong|em|u|a|img|figure|figcaption)\b/i.test(content);
}

export function sanitizePostHtml(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "blockquote",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "u",
      "a",
      "img",
      "figure",
      "figcaption"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class"],
      img: ["src", "alt"],
      figure: ["class"],
      p: ["class"],
      blockquote: ["class"]
    },
    allowedSchemes: ["http", "https"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noreferrer",
        target: "_blank"
      })
    }
  });
}
