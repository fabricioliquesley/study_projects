import { CourseWithTagsAndModules } from "@/@types/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Bookmark } from "lucide-react";

interface CourseItemProps {
  course: CourseWithTagsAndModules;
}

export function CourseItem({ course }: CourseItemProps) {
  return (
    <Link
      href={`/courses/details/${course.slug}`}
      className="bg-card hover:border-primary overflow-hidden rounded-lg border transition-all"
    >
      <Image
        src={course.thumbnailUrl || ""}
        alt={`Thumbnail of ${course.title}`}
        width={400}
        height={300}
        className="h-[300px] w-full object-cover"
      />
      <div className="flex flex-col gap-2 px-3 py-3.5">
        <h3 className="text-sm font-bold">{course.title}</h3>
        <div className="flex gap-2 overflow-hidden mask-r-from-80%">
          <Badge
            variant={"outline"}
            className="border-primary bg-primary/10 text-primary max-w-max gap-1"
          >
            <Bookmark size={14} />
            {course.modules.length} Modules
          </Badge>
          {course.tags.map((tag) => (
            <Badge
              key={`${course.id}-${tag.id}`}
              variant={"outline"}
              className="max-w-max"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
