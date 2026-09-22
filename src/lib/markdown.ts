import { createElement, type ReactNode } from "react";

const INLINE_TOKEN = /(`[^`\n]+`|\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|\n)/g;
const CODE_TOKEN =
  /(#.*$|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:and|as|async|await|break|case|catch|class|const|continue|def|do|else|elif|export|false|finally|for|from|function|if|import|in|let|new|null|or|return|switch|throw|true|try|var|while|yield)\b|\b\d+(?:\.\d+)?\b)/gm;
const KEYWORD = /^(?:and|as|async|await|break|case|catch|class|const|continue|def|do|else|elif|export|false|finally|for|from|function|if|import|in|let|new|null|or|return|switch|throw|true|try|var|while|yield)$/;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part === "\n") {
      return createElement("br", { key });
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return createElement(
        "code",
        {
          key,
          className:
            "rounded-md border border-border-dim bg-bg-darker/80 px-1.5 py-0.5 font-mono text-[0.875em] text-accent-cyan",
        },
        part.slice(1, -1),
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return createElement(
        "strong",
        { key, className: "font-bold text-text-primary" },
        part.slice(2, -2),
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return createElement(
        "em",
        { key, className: "italic text-text-primary/90" },
        part.slice(1, -1),
      );
    }

    return part;
  });
}

function cleanListItem(line: string): string {
  return line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim();
}

function renderList(
  lines: string[],
  ordered: boolean,
  keyPrefix: string,
): ReactNode {
  const tag = ordered ? "ol" : "ul";

  return createElement(
    tag,
    {
      key: keyPrefix,
      className: ordered
        ? "ml-5 list-decimal space-y-2 marker:font-mono marker:text-accent-cyan"
        : "ml-5 list-disc space-y-2 marker:text-accent-green",
    },
    lines.map((line, index) =>
      createElement(
        "li",
        { key: `${keyPrefix}-${index}`, className: "pl-1" },
        renderInline(cleanListItem(line), `${keyPrefix}-item-${index}`),
      ),
    ),
  );
}

function renderSection(
  title: string,
  firstLineContent: string,
  remainingLines: string[],
  keyPrefix: string,
): ReactNode {
  const lines = [firstLineContent, ...remainingLines]
    .map((line) => line.trim())
    .filter(Boolean);
  const normalizedTitle = title.toLocaleLowerCase("pt-BR");

  let content: ReactNode = null;

  if (lines.length > 0) {
    if (normalizedTitle === "hipóteses") {
      content = renderList(lines, false, `${keyPrefix}-list`);
    } else if (normalizedTitle === "verificações") {
      content = renderList(lines, true, `${keyPrefix}-list`);
    } else {
      content = createElement(
        "p",
        { className: "leading-7 text-text-primary/90" },
        renderInline(lines.join("\n"), `${keyPrefix}-content`),
      );
    }
  }

  return createElement(
    "section",
    { key: keyPrefix, className: "space-y-2.5" },
    createElement(
      "h3",
      {
        className:
          "flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-accent-green",
      },
      createElement("span", {
        className: "h-1.5 w-1.5 rounded-full bg-accent-green",
        "aria-hidden": true,
      }),
      title,
    ),
    content,
  );
}

function renderTextBlocks(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, blockIndex) => {
      const key = `${keyPrefix}-block-${blockIndex}`;
      const lines = block.split("\n");
      const sectionMatch = lines[0].match(
        /^\*\*(Resumo|Hipóteses|Verificações)\*\*\s*:?[ \t]*(.*)$/i,
      );

      if (sectionMatch) {
        return renderSection(
          sectionMatch[1],
          sectionMatch[2],
          lines.slice(1),
          key,
        );
      }

      if (lines.every((line) => /^\s*[-*•]\s+/.test(line))) {
        return renderList(lines, false, key);
      }

      if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) {
        return renderList(lines, true, key);
      }

      return createElement(
        "p",
        { key, className: "leading-7 text-text-primary/90" },
        renderInline(block, key),
      );
    });
}

function renderHighlightedCode(code: string, keyPrefix: string): ReactNode[] {
  return code.split(CODE_TOKEN).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    let className = "text-text-primary";

    if (token.startsWith("#") || token.startsWith("//")) {
      className = "text-text-secondary italic";
    } else if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      className = "text-accent-cyan";
    } else if (KEYWORD.test(token)) {
      className = "font-semibold text-accent-green";
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      className = "text-[#ffb86c]";
    }

    return createElement("span", { key, className }, token);
  });
}

function renderCodeBlock(
  language: string,
  code: string,
  keyPrefix: string,
): ReactNode {
  return createElement(
    "div",
    {
      key: keyPrefix,
      className:
        "overflow-hidden rounded-xl border border-border-dim bg-bg-darker shadow-inner",
    },
    createElement(
      "div",
      {
        className:
          "flex items-center justify-between border-b border-border-dim bg-bg-sidebar/80 px-4 py-2",
      },
      createElement(
        "span",
        {
          className:
            "font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-text-secondary",
        },
        language || "código",
      ),
      createElement("span", {
        className: "h-1.5 w-1.5 rounded-full bg-accent-green",
        "aria-hidden": true,
      }),
    ),
    createElement(
      "pre",
      {
        className:
          "scrollbar-hidden overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6",
      },
      createElement("code", null, renderHighlightedCode(code.trimEnd(), keyPrefix)),
    ),
  );
}

export function simpleMarkdownToJsx(text: string): ReactNode {
  const parts = text.split(/```([\w-]*)\s*\n?([\s\S]*?)```/g);
  const nodes: ReactNode[] = [];

  for (let index = 0; index < parts.length; index += 3) {
    const textPart = parts[index];
    const language = parts[index + 1];
    const code = parts[index + 2];

    if (textPart) {
      nodes.push(...renderTextBlocks(textPart, `text-${index}`));
    }

    if (code !== undefined) {
      nodes.push(renderCodeBlock(language, code, `code-${index}`));
    }
  }

  return createElement("div", { className: "space-y-4" }, nodes);
}
