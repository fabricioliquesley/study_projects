"use server";

import { prisma } from "@/lib/prisma";

interface GetCoursesPayload {
  query?: string;
  tags?: string | string[];
}

export async function getCourses({ query, tags: rawTags }: GetCoursesPayload) {
  const tags = !rawTags ? [] : Array.isArray(rawTags) ? rawTags : [rawTags];

  const hasTags = !!tags.length;
  const hasQuery = !!query;

  const courses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      tags: hasTags
        ? {
            some: {
              id: {
                in: tags,
              },
            },
          }
        : undefined,
      OR: hasQuery
        ? [{ title: { search: query }, description: { search: query } }]
        : undefined,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return courses;
}
