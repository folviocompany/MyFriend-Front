import { createElement, type ReactNode } from "react";

const MARKDOWN_TOKEN = /(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|\n)/g;

export function simpleMarkdownToJsx(text: string): ReactNode {
  return text.split(MARKDOWN_TOKEN).map((part, index) => {
    const key = `${index}-${part.slice(0, 12)}`;

    if (part === "\n") {
      return createElement("br", { key });
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return createElement("strong", { key }, part.slice(2, -2));
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return createElement("em", { key }, part.slice(1, -1));
    }

    return part;
  });
}
