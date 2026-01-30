type Course = import("@/generated/prisma/client").Course;
type Tags = import("@/generated/prisma/client").CourseTag;
type Module = import("@/generated/prisma/client").CourseModule;

export type CourseWithTagsAndModules = Course & {
  tags: Tag[];
  modules: Module[];
};
