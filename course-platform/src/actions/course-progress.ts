"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";
import { getCourseWithoutModulesAndLessons } from "./courses";

interface MarkLessonAsCompletedPayload {
  courseSlug: string;
  lessonId: string;
}

export async function markLessonAsCompleted({
  courseSlug,
  lessonId,
}: MarkLessonAsCompletedPayload) {
  const { id: userId } = await getUser();

  const course = await getCourseWithoutModulesAndLessons(courseSlug);

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

export async function unmarkLessonAsCompleted(lessonId: string) {
  const { id: userId } = await getUser();

  const completedLesson = await prisma.completedLesson.findFirst({
    where: {
      lessonId,
      userId,
    },
  });

  if (!completedLesson) return;

  await prisma.completedLesson.delete({
    where: {
      id: completedLesson.id,
    },
  });
}

export async function getCourseProgress(courseSlug: string) {
  const { id: userId } = await getUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
    include: {
      modules: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!course) throw new Error("Course not found");

  const completedLessons = await prisma.completedLesson.findMany({
    where: {
      courseId: course.id,
      userId,
    },
  });

  const totalLessons = course.modules.flatMap(
    (mod) => mod.lessons.length,
  ).length;
  const completedLessonsCount = completedLessons.length;

  const progress = Math.round((completedLessonsCount / totalLessons) * 100);

  return {
    completedLessons,
    progress,
  };
}
