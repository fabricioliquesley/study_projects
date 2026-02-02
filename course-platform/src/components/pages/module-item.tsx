import type { CompletedLesson, CourseModuleWithLessons } from "@/@types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { CircularProgress } from "../shared/circular-progress";
import { cn, formatDuration } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { LessonItem } from "./lesson-item";
import { useMemo } from "react";

interface ModuleItemProps {
  courseModule: CourseModuleWithLessons;
  completedLessons: CompletedLesson[];
}

export function ModuleItem({
  courseModule,
  completedLessons,
}: ModuleItemProps) {
  const totalLessons = courseModule.lessons.length;
  const totalDuration = courseModule.lessons.reduce(
    (total, lesson) => total + lesson.durationInMs,
    0,
  );

  const formattedDuration = formatDuration(totalDuration);

  const completedLessonsIds: string[] = useMemo(
    () => completedLessons.map((lesson) => lesson.lessonId),
    [completedLessons],
  );

  const moduleProgress = useMemo(() => {
    const completedLessonsCount = completedLessonsIds.filter((lessonId) => {
      return courseModule.lessons.some((lesson) => lesson.id === lessonId);
    }).length;

    return Math.round((completedLessonsCount / totalLessons) * 100);
  }, [completedLessonsIds, courseModule.lessons, totalLessons]);

  return (
    <Accordion.Item
      value={courseModule.id}
      className="border-border group rounded-lg border"
    >
      <Accordion.Trigger className="hover:bg-muted/50 flex w-full items-center gap-4 p-4 transition-all">
        <div
          className={cn(
            "relative flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-black/70 font-semibold transition-all",
            moduleProgress >= 100 && "text-primary bg-primary/10",
          )}
        >
          {courseModule.order}
          <CircularProgress
            progress={moduleProgress}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="text-muted-foreground flex flex-1 flex-col gap-0.5 text-left">
          <p className="font-medium text-white/80">{courseModule.title}</p>
          <div className="flex items-center gap-2 text-xs">
            <span>
              {totalLessons} lesson{totalLessons === 1 ? "" : "s"}
            </span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        <ChevronDown className="text-muted-foreground ml-auto h-4 w-4 transition-all group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content className="data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden">
        <div className="flex flex-col p-2">
          {courseModule.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              completed={completedLessonsIds.includes(lesson.id)}
            />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
