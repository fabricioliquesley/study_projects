"use client";

import Link from "next/link";
import { BackButton } from "../shared/back-button";
import { CourseWithModulesAndLessons } from "@/@types/types";
import { ToggleModuleListCollapsed } from "../shared/toggle-module-list-collapsed";
import { ToggleAutoplay } from "../shared/toggle-autoplay";
import { useParams } from "next/navigation";

interface TopDetailsProps {
  course: CourseWithModulesAndLessons;
}

export function TopDetails({ course }: TopDetailsProps) {
  const params = useParams();

  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const currentModule = course.modules.find((module) => module.id === moduleId);
  const currentLesson = currentModule?.lessons?.find(
    (lesson) => lesson.id === lessonId,
  );

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
        <p className="line-clamp-1 hidden sm:block">{currentModule?.title}</p>
        <span className="text-muted-foreground hidden sm:block">/</span>
        <p className="line-clamp-1">{currentLesson?.title}</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <ToggleAutoplay />
        <ToggleModuleListCollapsed className="sm:hidden" />
      </div>
    </div>
  );
}
