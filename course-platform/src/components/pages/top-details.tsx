import Link from "next/link";
import { BackButton } from "../shared/back-button";
import { Course } from "@/@types/types";

interface TopDetailsProps {
  course: Course;
}

export function TopDetails({ course }: TopDetailsProps) {
  return (
    <div className="border-border bg-sidebar sticky top-0 z-10 flex w-full items-center gap-4 border-b p-4 sm:gap-6 sm:p-6">
      <BackButton />

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link
          href={`/courses/details/${course.slug}`}
          className="hover:text-primary line-clamp-1 font-semibold transition-all"
        >
          {course.title}
        </Link>
        <span className="text-muted-foreground">/</span>
        <p className="line-clamp-1 hidden sm:block">module title</p>
        <span className="text-muted-foreground hidden sm:block">/</span>
        <p className="line-clamp-1">lesson title</p>
      </div>

      <div className="ml-auto flex items-center gap-4"></div>
    </div>
  );
}
