export type Course = import("@/generated/prisma/client").Course;
export type Tags = import("@/generated/prisma/client").CourseTag;
export type Module = import("@/generated/prisma/client").CourseModule;
export type Lesson = import("@/generated/prisma/client").CourseLesson;
export type CompletedLesson =
  import("@/generated/prisma/client").CompletedLesson;

export type CourseWithTagsAndModules = Course & {
  tags: Tag[];
  modules: Module[];
};

export type CourseModuleWithLessons = Module & {
  lessons: Lesson[];
};
