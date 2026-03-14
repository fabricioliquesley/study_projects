import * as Switch from "@base-ui/react/switch";
import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggle = tv({
  base: [
    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
    "duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    checked: {
      true: "bg-accent-green",
      false: "bg-bg-elevated",
    },
  },
  defaultVariants: {
    checked: false,
  },
});

const thumb = tv({
  base: [
    "pointer-events-none block h-5 w-5 rounded-full bg-text-tertiary shadow-lg ring-0",
    "transition-transform duration-200 ease-in-out",
  ],
  variants: {
    checked: {
      true: "translate-x-5 bg-white",
      false: "translate-x-0",
    },
  },
  defaultVariants: {
    checked: false,
  },
});

type ToggleVariants = VariantProps<typeof toggle>;

type ToggleProps = Omit<
  ComponentProps<typeof Switch.Switch.Root>,
  "className"
> &
  ToggleVariants & { className?: string };

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, className, ...props }, ref) => {
    return (
      <Switch.Switch.Root
        ref={ref}
        checked={checked}
        className={toggle({ checked: checked as boolean, className })}
        {...props}
      >
        <Switch.Switch.Thumb
          className={thumb({ checked: checked as boolean })}
        />
      </Switch.Switch.Root>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, toggle, type ToggleProps, type ToggleVariants };
