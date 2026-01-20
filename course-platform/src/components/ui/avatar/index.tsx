import { cn } from "@/lib/utils";
import {
  Avatar as AvatarRoot,
  AvatarFallback,
  AvatarImage,
} from "./primitives";

interface AvatarProps {
  src?: string | null;
  fallback?: string | null;
  className?: string;
}

export const Avatar = ({ src, fallback, className }: AvatarProps) => {
  return (
    <AvatarRoot className={cn("h-8 w-8 rounded-lg", className)}>
      <AvatarImage src={src ?? undefined} />
      <AvatarFallback className="rounded-lg" />
    </AvatarRoot>
  );
};
