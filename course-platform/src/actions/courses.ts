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
    include: {
      tags: true,
      modules: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
}

export async function getCourseBySlug(slug: string) {
  if (!slug) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      tags: true,
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return course;
}

export async function getCourseById(id: string) {
  if (!id) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      tags: true,
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return course;
}
