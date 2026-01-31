import { Lesson } from "@/@types/types";
import { cn, formatDuration } from "@/lib/utils";
import { CircleCheckBig, CircleX, Video } from "lucide-react";
import Link from "next/link";

interface LessonItemProps {
  lesson: Lesson;
}

export function LessonItem({ lesson }: LessonItemProps) {
  const currentLessonId = "cmkyrpvmq0037rvsbdx8s9uh7";
  const completed = true;

  const PrimaryIcon = completed ? CircleCheckBig : Video;
  const SecondaryIcon = completed ? CircleX : CircleCheckBig;

  return (
    <Link
      href={`/course/course-slug/${lesson.moduleId}/lesson/${lesson.id}`}
      className={cn(
        "text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 text-sm transition-all",
        lesson.id === currentLessonId && "text-white",
        completed && "text-primary",
      )}
    >
      <button
        type="button"
        className="group/lesson-button relative h-4 w-4 min-w-4"
      >
        <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
        <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
      </button>
      <p className="line-clamp-1">{lesson.title}</p>
      <p className="text-muted-foreground ml-auto text-xs">
        {formatDuration(lesson.durationInMs, true)}
      </p>
    </Link>
  );
}
