"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";

type createLessonCommentPayload = {
  courseSlug: string;
  lessonId: string;
  content: string;
  parentId?: string;
};

export const createLessonComment = async ({
  courseSlug,
  lessonId,
  content,
  parentId,
}: createLessonCommentPayload) => {
  const { id: userId } = await getUser();

  if (content.length > 500)
    throw new Error("Comment cannot be longer than 500 characters");

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  });

  if (!course) throw new Error("Course not found");

  const lesson = await prisma.courseLesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) throw new Error("Lesson not found");

  const comment = await prisma.lessonComment.create({
    data: {
      lessonId,
      userId,
      content,
      parentId,
    },
  });

  return comment;
};
