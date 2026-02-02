import { Lesson } from "@/@types/types";
import { LessonPlayer } from "./lesson-player";

interface LessonDetailsProps {
  lesson: Lesson;
  nextLesson?: Lesson;
}

export function LessonDetails({ lesson, nextLesson }: LessonDetailsProps) {
  return (
    <>
      <LessonPlayer lesson={lesson} nextLesson={nextLesson} />

      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>
    </>
  );
}
