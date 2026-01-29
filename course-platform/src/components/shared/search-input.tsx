"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTags = searchParams.get("tags");
  const currentQuery = searchParams.get("query");

  useEffect(() => {
    if (currentQuery === debouncedQuery) return;
    if (!currentQuery && !debouncedQuery) return;

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          tags: currentTags,
          query: debouncedQuery,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }, [currentQuery, debouncedQuery, currentTags, pathname, router]);

  return (
    <div className="relative max-w-[400px] flex-1">
      <Input
        className="peer h-9 pl-9"
        placeholder="Search for a course"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
      <Search className="text-muted-foreground peer-focus:text-primary absolute top-1/2 left-3 -translate-y-1/2 transition-all" />
    </div>
  );
}
