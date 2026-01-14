import { Input } from "../ui/input";

export function SearchInput() {
  return (
    <div className="relative max-w-[400px] flex-1">
      <Input className="h-9" placeholder="Search for a course" />
    </div>
  );
}
