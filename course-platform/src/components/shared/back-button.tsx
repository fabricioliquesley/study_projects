"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface BackButtonProps extends ComponentProps<"button"> {}

export const BackButton = ({ className, ...props }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      {...props}
      type="button"
      className={cn(
        "text-muted-foreground hover:text-primary flex max-w-max items-center gap-2 text-xs transition-all sm:text-sm",
        className,
      )}
      onClick={() => router.back()}
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
};
