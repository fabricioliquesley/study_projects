import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showHeader?: boolean;
  height?: number;
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "bash",
  "markdown",
] as const;

export async function CodeBlock({
  code,
  language = "javascript",
  filename,
  showHeader = true,
  height,
}: CodeBlockProps) {
  const normalizedLanguage = LANGUAGES.includes(
    language as (typeof LANGUAGES)[number],
  )
    ? language
    : "javascript";

  const html = await codeToHtml(code.trim(), {
    lang: normalizedLanguage,
    theme: "vesper",
  });

  const lines = code.trim().split("\n");

  return (
    <div
      className="flex flex-col rounded-m border border-border-primary overflow-hidden"
      style={height ? { height: `${height}px` } : undefined}
    >
      {showHeader && (
        <div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
          </div>
          {filename && (
            <span className="font-mono text-xs text-text-tertiary">
              {filename}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-1 bg-bg-input min-h-0 overflow-x-hidden overflow-y-auto">
        <div className="flex w-10 flex-col border-r border-border-primary bg-bg-surface py-[10px] text-center self-stretch gap-1.5 overflow-y-auto overflow-x-hidden">
          {/* biome-ignore lint: line numbers are stable for code display */}
          {lines.map((line, index) => (
            <span
              key={line + index}
              className="font-mono text-xs leading-6 text-text-tertiary pl-[10px]"
            >
              {index + 1}
            </span>
          ))}
        </div>
        <div
          className="flex-1 overflow-x-hidden overflow-y-auto py-[14px] px-4 font-mono text-[13px] leading-6 gap-1.5"
          // biome-ignore lint: shiki returns safe HTML
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export type { CodeBlockProps };
