"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

export function SearchInput() {
  const [query, setQuery] = useState("");

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
