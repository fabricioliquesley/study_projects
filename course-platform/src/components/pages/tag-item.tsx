"use client";

import type { CourseTag } from "@/generated/prisma/client";
import { Badge } from "../ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface TagItemProps {
  tag: CourseTag;
}

export function TagItem({ tag }: TagItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIds = searchParams.getAll("tags");
  const currentQuery = searchParams.get("query");

  const isSelected = currentIds?.includes(tag.id.toString());

  const onSelect = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          query: currentQuery,
          tags: isSelected
            ? currentIds.filter((id) => id !== tag.id)
            : [...currentIds, tag.id],
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      },
    );

    router.push(url);
  };

  return (
    <Badge
      onClick={onSelect}
      variant={isSelected ? "default" : "outline"}
      className="hover:border-primary cursor-pointer! whitespace-nowrap"
    >
      {tag.name}
    </Badge>
  );
}
