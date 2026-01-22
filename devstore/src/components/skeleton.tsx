import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-50/10", className)}
      {...props}
    />
  );
}
