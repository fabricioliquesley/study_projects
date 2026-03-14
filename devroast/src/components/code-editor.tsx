import { tv, type VariantProps } from "tailwind-variants";

const codeEditor = tv({
  base: [
    "flex flex-col rounded-m border border-border-primary overflow-hidden",
  ],
});

type CodeEditorVariants = VariantProps<typeof codeEditor>;

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  filename?: string;
  showHeader?: boolean;
  className?: string;
} & VariantProps<typeof codeEditor>;

function CodeEditor({
  value,
  onChange,
  filename,
  showHeader = true,
  className,
}: CodeEditorProps) {
  const lines = value.split("\n");

  return (
    <div className={codeEditor({ className })}>
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
      <div className="flex min-h-[360px] bg-bg-input">
        <div className="flex w-12 flex-col border-r border-border-primary bg-bg-surface py-3 text-center">
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
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 resize-none bg-transparent p-3 font-mono text-[13px] leading-6 text-text-primary outline-none placeholder:text-text-tertiary"
          placeholder="// paste your code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}

CodeEditor.displayName = "CodeEditor";

export {
  CodeEditor,
  codeEditor,
  type CodeEditorProps,
  type CodeEditorVariants,
};
