import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-accent-green text-primary-foreground hover:opacity-90",
      secondary: "bg-bg-elevated text-text-primary hover:bg-border-secondary",
      outline:
        "border border-border-primary bg-transparent hover:bg-bg-elevated",
      ghost: "hover:bg-bg-elevated text-text-primary",
      destructive: "bg-accent-red text-white hover:opacity-90",
    },
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-6 text-sm",
      lg: "h-12 px-8 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
