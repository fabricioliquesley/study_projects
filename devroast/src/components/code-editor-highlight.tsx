import { MAX_CHARS } from "@/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Highlighter, createHighlighter } from "shiki";

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

// Singleton — instância criada uma única vez e reutilizada
let _highlighter: Highlighter | null = null;
let _highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (_highlighter) return _highlighter;
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({
      langs: LANGUAGES.map((l) => l.value),
      themes: ["vesper"],
    }).then((h) => {
      _highlighter = h;
      return h;
    });
  }
  return _highlighterPromise;
}

export async function highlightCode(
  code: string,
  language: Language,
): Promise<string> {
  if (!code.trim()) return "";
  try {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, { lang: language, theme: "vesper" });
  } catch {
    const highlighter = await getHighlighter();
    return highlighter.codeToHtml(code, { lang: "text", theme: "vesper" });
  }
}

// Debounce hook — evita highlight a cada keystroke
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
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
  if (/^\{/m.test(trimmed) && /"[^"]+": /m.test(trimmed)) return "json";
  if (/^(---|\w+:)/m.test(trimmed)) return "yaml";
  if (/^(#!|\b(bash|sh|zsh|echo|ls|cd|grep|awk|sed)\b)/m.test(trimmed))
    return "bash";
  if (/^(#|\*\*|```)/m.test(trimmed)) return "markdown";

  return "javascript";
}

interface CodeEditorHighlightProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  onLanguageChange?: (language: Language) => void;
  filename?: string;
  showHeader?: boolean;
  showLanguageSelector?: boolean;
  maxLength?: number;
  onOverLimit?: (isOver: boolean) => void;
}

export function CodeEditorHighlight({
  value,
  onChange,
  language,
  onLanguageChange,
  filename,
  showHeader = true,
  showLanguageSelector = true,
  maxLength = MAX_CHARS,
  onOverLimit,
}: CodeEditorHighlightProps) {
  const [highlightedHtml, setHighlightedHtml] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const charCount = value.length;
  const isOverLimit = charCount > maxLength;
  const isNearLimit = charCount >= maxLength * 0.8;

  // Debounce no value — language muda raramente e re-destaca imediatamente
  const debouncedValue = useDebounce(value, 300);

  // Cleanup flag evita race condition entre chamadas concorrentes
  useEffect(() => {
    if (!debouncedValue.trim()) {
      setHighlightedHtml("");
      return;
    }
    let cancelled = false;
    highlightCode(debouncedValue, language).then((html) => {
      if (!cancelled) setHighlightedHtml(html);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedValue, language]);

  // Notifica o pai sempre que o estado de limite muda
  useEffect(() => {
    onOverLimit?.(isOverLimit);
  }, [isOverLimit, onOverLimit]);

  // Sincroniza scroll do highlight e dos line numbers com a textarea
  const syncScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  // Tab insere 2 espaços em vez de perder o foco
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = e.currentTarget;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newValue = `${value.substring(0, start)}  ${value.substring(end)}`;
        onChange(newValue);
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 2;
            textareaRef.current.selectionEnd = start + 2;
          }
        });
      }
    },
    [value, onChange],
  );

  const lines = value.split("\n");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange?.(e.target.value as Language);
  };

  const counterColor = isOverLimit
    ? "text-accent-red font-medium"
    : isNearLimit
      ? "text-accent-amber"
      : "text-text-tertiary";

  return (
    <div className="flex flex-col rounded-md border border-border-primary overflow-hidden">
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

      {/* overflow-hidden no container — scroll controlado pela textarea */}
      <div className="flex h-[360px] overflow-hidden bg-bg-input">

        {/* line numbers com overflow-hidden; scroll sincronizado via JS */}
        <div
          ref={lineNumbersRef}
          className="flex w-12 flex-col border-r border-border-primary bg-bg-surface py-3 text-center shrink-0 overflow-hidden select-none"
        >
          {lines.map((_, idx) => (
            <span
              key={`ln-${idx + 1}`}
              className="font-mono text-xs leading-6 text-text-tertiary ml-3"
            >
              {idx + 1}
            </span>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden bg-bg-input">
          {/*
           * pointer-events-none impede que o <pre> do Shiki intercepte
           * cliques e foco que pertencem à textarea.
           * [&_pre]:!bg-transparent sobrescreve o background inline
           * que o Shiki injeta no <pre>, expondo o bg do container.
           */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-3 font-mono text-[13px] leading-6 overflow-hidden pointer-events-none select-none [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-0 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-6"
            // biome-ignore lint: shiki returns safe HTML
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {/*
           * z-10 garante que a textarea fique sobre o <pre> do Shiki
           * (que cria um novo stacking context), permitindo edição.
           * whitespace-pre preserva indentação sem quebrar linhas.
           */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 z-10 w-full h-full resize-none bg-transparent p-3 font-mono text-[13px] leading-6 text-transparent caret-white outline-none placeholder:text-text-tertiary overflow-auto whitespace-pre"
            placeholder="// paste your code here..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Counter — canto inferior direito, z-20 para ficar acima da textarea */}
          <div className="absolute bottom-0 right-0 z-20 px-3 py-1.5 pointer-events-none">
            <span
              className={`font-mono text-xs tabular-nums transition-colors duration-200 ${counterColor}`}
            >
              {charCount.toLocaleString("pt-BR")} /{" "}
              {maxLength.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CodeEditorHighlightProps, Language };
export { LANGUAGES, detectLanguage };
