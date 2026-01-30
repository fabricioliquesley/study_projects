import { Lesson } from "@/@types/types";
import { LessonPlayer } from "./lesson-player";

interface LessonDetailsProps {
  lesson: Lesson;
}

export function LessonDetails({ lesson }: LessonDetailsProps) {
  return (
    <>
      <LessonPlayer lesson={lesson} />

      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>
    </>
  );
}
