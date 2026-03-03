export type Course = import("@/generated/prisma/client").Course;
export type Tags = import("@/generated/prisma/client").CourseTag;
export type Module = import("@/generated/prisma/client").CourseModule;
export type Lesson = import("@/generated/prisma/client").CourseLesson;
export type CompletedLesson =
  import("@/generated/prisma/client").CompletedLesson;
export type LessonComment = import("@/generated/prisma/client").LessonComment;
export type User = import("@/generated/prisma/client").User;

export type CourseWithTagsAndModules = Course & {
  tags: Tag[];
  modules: Module[];
};

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
};

export type CourseWithModulesAndLessons = Course & {
  modules: ModuleWithLessons[];
};

export type CourseModuleWithLessons = Module & {
  lessons: Lesson[];
};

export type LessonCommentWithUserAndReplies = LessonComment & {
  user: User;
  commentReplies?: LessonCommentWithUserAndReplies[];
};
