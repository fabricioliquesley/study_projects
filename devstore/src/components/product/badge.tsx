import { cn } from "@/lib/utils";

interface ProductBadgeProps {
  title: string;
  price: string;
  className?: string;
}

export function ProductBadge({ title, price, className }: ProductBadgeProps) {
  return (
    <div
      className={cn(
        "absolute flex h-12 max-w-[280px] items-center gap-2 rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5",
        className,
      )}
    >
      <span className="truncate text-sm">{title}</span>
      <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
        {price}
      </span>
    </div>
  );
}
