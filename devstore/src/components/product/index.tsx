import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  children: React.ReactNode;
  href: string;
  src: string;
  alt?: string;
  className?: string;
}

export function Product({ children, href, src, alt, className }: ProductProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative col-span-6 row-span-6 flex items-start justify-center overflow-hidden rounded-lg bg-zinc-900",
        className,
      )}
    >
      <Image
        src={src}
        className="transition-transform duration-500 group-hover:scale-105"
        width={920}
        height={920}
        quality={100}
        alt={alt || ""}
      />

      {children}
    </Link>
  );
}
