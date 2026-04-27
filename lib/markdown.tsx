import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.use({
  gfm: true,
  breaks: true
});

export function renderMarkdown(markdown: string | null | undefined) {
  const html = marked.parse(markdown ?? "", { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer"
      })
    }
  });
}

export function MarkdownContent({ content }: { content: string | null | undefined }) {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
