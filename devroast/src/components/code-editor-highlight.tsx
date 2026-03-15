import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "bash", label: "Bash" },
  { value: "markdown", label: "Markdown" },
] as const;

type Language = (typeof LANGUAGES)[number]["value"];

interface CodeEditorHighlightProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  onLanguageChange?: (language: Language) => void;
  filename?: string;
  showHeader?: boolean;
  showLanguageSelector?: boolean;
}

function detectLanguage(code: string): Language {
  const trimmed = code.trim().toLowerCase();

  if (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    /<[a-z]+[^>]*>/i.test(trimmed)
  ) {
    return "html";
  }
  if (trimmed.startsWith("<?php")) return "php";
  if (
    /^(import|export|const|let|var|function|class|interface|type)\s/m.test(
      trimmed,
    )
  ) {
    if (/: \w+/.test(trimmed) || /<[\w<>]+\s*>/.test(trimmed))
      return "typescript";
    return "javascript";
  }
  if (/^(def|class|import|from|print|if __name__|async def)\s/m.test(trimmed))
    return "python";
  if (/^(fn|let|mut|use|pub|struct|impl|trait|enum|match)\s/m.test(trimmed))
    return "rust";
  if (/^(package|func|import|type|struct|interface|go)\s/m.test(trimmed))
    return "go";
  if (
    /^(public|private|class|interface|void|static|import java)\s/m.test(trimmed)
  )
    return "java";
  if (/^(#include|int main|void|printf|scanf)\s/m.test(trimmed)) return "cpp";
  if (/^(def|end|class|module|require|attr_accessor)\s/m.test(trimmed))
    return "ruby";
  if (/^(select|insert|update|delete|create|alter|drop)\s/im.test(trimmed))
    return "sql";
  if (/^\{/m.test(trimmed) && /"[^"]+"\s*:/m.test(trimmed)) return "json";
  if (/^(---|\w+:)/m.test(trimmed)) return "yaml";
  if (/^(#!|\b(bash|sh|zsh|echo|ls|cd|grep|awk|sed)\b)/m.test(trimmed))
    return "bash";
  if (/^(#|\*\*|```)/m.test(trimmed)) return "markdown";

  return "javascript";
}

export async function highlightCode(
  code: string,
  language: Language,
): Promise<string> {
  if (!code.trim()) return "";

  try {
    const html = await codeToHtml(code.trim(), {
      lang: language,
      theme: "vesper",
    });
    return html;
  } catch {
    const html = await codeToHtml(code.trim(), {
      lang: "text",
      theme: "vesper",
    });
    return html;
  }
}

export function CodeEditorHighlight({
  value,
  onChange,
  language,
  onLanguageChange,
  filename,
  showHeader = true,
  showLanguageSelector = true,
}: CodeEditorHighlightProps) {
  const [highlightedHtml, setHighlightedHtml] = useState("");

  useEffect(() => {
    if (!value.trim()) {
      setHighlightedHtml("");
      return;
    }

    highlightCode(value, language).then(setHighlightedHtml);
  }, [value, language]);

  const lines = value.split("\n");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    onLanguageChange?.(newLang);
  };

  return (
    <div className="flex flex-col rounded-m border border-border-primary overflow-hidden">
      {showHeader && (
        <div className="flex h-10 items-center justify-between border-b border-border-primary px-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
          </div>

          <div className="flex items-center gap-3">
            {showLanguageSelector && onLanguageChange && (
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-bg-surface border border-border-primary rounded px-2 py-1 font-mono text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-border-focus"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            )}

            {filename && (
              <span className="font-mono text-xs text-text-tertiary">
                {filename}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex max-h-[360px] overflow-auto bg-bg-input">
        <div className="flex w-12 flex-col border-r border-border-primary bg-bg-surface py-3 text-center shrink-0 h-max">
          {/* biome-ignore lint: line numbers are stable for display */}
          {lines.map((_, idx) => (
            <span
              // biome-ignore lint: line numbers are stable for display
              key={`ln-${idx + 1}`}
              className="font-mono text-xs leading-6 text-text-tertiary ml-3"
            >
              {idx + 1}
            </span>
          ))}
          {lines.length === 0 && (
            <span className="font-mono text-xs leading-6 text-text-tertiary ml-3">
              1
            </span>
          )}
        </div>

        <div className="flex-1 relative bg-bg-input">
          <div
            className="w-full p-3 font-mono text-[13px] leading-6"
            // biome-ignore lint: shiki returns safe HTML
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full resize-none overflow-hidden bg-transparent p-3 font-mono text-[13px] leading-6 text-transparent outline-none placeholder:text-text-tertiary caret-white"
            placeholder="// paste your code here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

export type { CodeEditorHighlightProps, Language };
export { LANGUAGES, detectLanguage };
