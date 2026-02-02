"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";

interface MarkLessonAsCompletedPayload {
  courseSlug: string;
  lessonId: string;
}

export async function markLessonAsCompleted({
  courseSlug,
  lessonId,
}: MarkLessonAsCompletedPayload) {
  const { id: userId } = await getUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  });

  if (!course) throw new Error("Course not found");

  const isAlreadyCompleted = await prisma.completedLesson.findFirst({
    where: {
      lessonId,
      userId,
    },
  });

  if (isAlreadyCompleted) return isAlreadyCompleted;

  const completedLesson = await prisma.completedLesson.create({
    data: {
      lessonId,
      userId,
      courseId: course.id,
    },
  });

  return completedLesson;
}
