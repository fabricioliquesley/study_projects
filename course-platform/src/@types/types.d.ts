export type Course = import("@/generated/prisma/client").Course;
export type Tags = import("@/generated/prisma/client").CourseTag;
export type Module = import("@/generated/prisma/client").CourseModule;
export type Lesson = import("@/generated/prisma/client").CourseLesson;

export type CourseWithTagsAndModules = Course & {
  tags: Tag[];
  modules: Module[];
};
