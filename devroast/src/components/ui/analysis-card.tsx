import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";
import { Badge, type BadgeVariants } from "./badge";

const analysisCard = tv({
  base: [
    "flex flex-col gap-3 rounded-[var(--radius-m)] border border-border-primary p-5",
  ],
});

type AnalysisCardRootProps = ComponentProps<"div">;

function AnalysisCardRoot({ className, ...props }: AnalysisCardRootProps) {
  return <div className={analysisCard({ className })} {...props} />;
}

type AnalysisCardBadgeProps = ComponentProps<typeof Badge> & BadgeVariants;

function AnalysisCardBadge({
  variant,
  className,
  ...props
}: AnalysisCardBadgeProps) {
  return <Badge variant={variant} className={className} {...props} />;
}

const analysisCardTitle = tv({
  base: ["font-mono text-[13px] text-text-primary"],
});

type AnalysisCardTitleProps = ComponentProps<"p">;

function AnalysisCardTitle({ className, ...props }: AnalysisCardTitleProps) {
  return <p className={analysisCardTitle({ className })} {...props} />;
}

const analysisCardDescription = tv({
  base: ["font-sans text-xs leading-relaxed text-text-secondary"],
});

type AnalysisCardDescriptionProps = ComponentProps<"p">;

function AnalysisCardDescription({
  className,
  ...props
}: AnalysisCardDescriptionProps) {
  return <p className={analysisCardDescription({ className })} {...props} />;
}

export {
  AnalysisCardRoot,
  AnalysisCardBadge,
  AnalysisCardTitle,
  AnalysisCardDescription,
  analysisCard,
  type AnalysisCardRootProps,
  type AnalysisCardBadgeProps,
  type AnalysisCardTitleProps,
  type AnalysisCardDescriptionProps,
};
