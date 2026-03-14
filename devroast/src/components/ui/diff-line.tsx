import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: ["flex font-mono text-[13px] px-4 py-2"],
  variants: {
    type: {
      removed: "bg-[#1A0A0A]",
      added: "bg-[#0A1A0F]",
      context: "",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineVariants = VariantProps<typeof diffLine>;

type DiffLineProps = ComponentProps<"div"> & DiffLineVariants;

function DiffLine({ type, className, children, ...props }: DiffLineProps) {
  const prefix = type === "removed" ? "-" : type === "added" ? "+" : " ";

  const prefixColor =
    type === "removed"
      ? "text-accent-red"
      : type === "added"
        ? "text-accent-green"
        : "text-text-tertiary";

  const codeColor =
    type === "added" ? "text-text-primary" : "text-text-secondary";

  return (
    <div className={diffLine({ type, className })} {...props}>
      <span className={`select-none pr-2 ${prefixColor}`}>{prefix}</span>
      <span className={`flex-1 ${codeColor}`}>{children}</span>
    </div>
  );
}

export { DiffLine, diffLine, type DiffLineProps, type DiffLineVariants };
