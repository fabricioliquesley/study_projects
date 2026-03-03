"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./user";
import { checkRole } from "@/lib/clerk";

type createLessonCommentPayload = {
  courseSlug: string;
  lessonId: string;
  content: string;
  parentId?: string;
};

export const getLessonComments = async (lessonId: string) => {
  await getUser();

  const comments = await prisma.lessonComment.findMany({
    where: {
      lessonId,
      parentId: null,
    },
    include: {
      user: true,
      commentReplies: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
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

export const deleteComment = async (commentId: string) => {
  const { id: userId } = await getUser();

  const isAdmin = await checkRole("admin");

  const comment = await prisma.lessonComment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) throw new Error("Comment not found");

  if (!isAdmin && comment.userId !== userId)
    throw new Error("You do not have permission to delete this comment.");

  await prisma.lessonComment.delete({
    where: {
      id: commentId,
    },
  });
};
