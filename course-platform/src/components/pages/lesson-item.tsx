"use client";

import { Lesson } from "@/@types/types";
import { cn, formatDuration } from "@/lib/utils";
import { CircleCheckBig, CircleX, Video } from "lucide-react";
import Link from "next/link";
import { TooltipWrapper } from "../ui/tootipWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  markLessonAsCompleted,
  unmarkLessonAsCompleted,
} from "@/actions/course-progress";
import { queryKeys } from "@/constants/query-keys";

interface LessonItemProps {
  lesson: Lesson;
  completed: boolean;
}

export function LessonItem({ lesson, completed }: LessonItemProps) {
  const params = useParams();
  const queryClient = useQueryClient();

  const currentLessonId = params.lessonId as string;
  const courseSlug = params.slug as string;

  const PrimaryIcon = completed ? CircleCheckBig : Video;
  const SecondaryIcon = completed ? CircleX : CircleCheckBig;

  const lessonId = lesson.id;

  const { mutate: completeLesson, isPending: isCompletingLesson } = useMutation(
    {
      mutationFn: () => markLessonAsCompleted({ courseSlug, lessonId }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courseProgress(courseSlug),
        });
      },
    },
  );

  const { mutate: notCompleteLesson, isPending: isNotCompletingLesson } =
    useMutation({
      mutationFn: () => unmarkLessonAsCompleted(lessonId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courseProgress(courseSlug),
        });
      },
    });

  const handleToggleCompleteLesson = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (completed) return notCompleteLesson();

    completeLesson();
  };

  const isLoading = isCompletingLesson || isNotCompletingLesson;

  return (
    <Link
      href={`/courses/${courseSlug}/${lesson.moduleId}/lesson/${lesson.id}`}
      className={cn(
        "text-muted-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md p-2 text-sm transition-all",
        lesson.id === currentLessonId && "text-white",
        completed && "text-primary",
      )}
    >
      <TooltipWrapper content={completed ? "Mark as unseen" : "Mark as seem"}>
        <button
          onClick={handleToggleCompleteLesson}
          disabled={isLoading}
          type="button"
          className="group/lesson-button relative h-4 w-4 min-w-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
          <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
        </button>
      </TooltipWrapper>
      <p className="line-clamp-1">{lesson.title}</p>
      <p className="text-muted-foreground ml-auto text-xs">
        {formatDuration(lesson.durationInMs, true)}
      </p>
    </Link>
  );
}
