import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: ["inline-flex items-center gap-2 font-mono text-xs font-normal"],
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-primary",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

type BadgeVariants = VariantProps<typeof badge>;

type BadgeProps = ComponentProps<"span"> & BadgeVariants;

function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={badge({ variant, className })} {...props}>
      <span
        className={
          variant === "critical"
            ? "bg-accent-red"
            : variant === "warning"
              ? "bg-accent-amber"
              : variant === "good"
                ? "bg-accent-green"
                : "bg-primary"
        }
        style={{ display: "block", width: 8, height: 8, borderRadius: "50%" }}
      />
      {children}
    </span>
  );
}

export { Badge, badge, type BadgeProps, type BadgeVariants };
