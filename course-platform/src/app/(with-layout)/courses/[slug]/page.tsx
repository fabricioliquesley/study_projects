import { getCourseProgress } from "@/actions/course-progress";
import { getCourseBySlug } from "@/actions/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, redirect } from "next/navigation";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const { completedLessons } = await getCourseProgress(slug);

  const allLessons = course.modules.flatMap((module) => module.lessons);

  let lessonToRedirect = allLessons[0];

  const firstUncompletedLesson = allLessons.find((lesson) => {
    const completed = completedLessons.some(
      (completedLesson) => completedLesson.lessonId === lesson.id,
    );

    return !completed;
  });

  if (firstUncompletedLesson) lessonToRedirect = firstUncompletedLesson;

  if (lessonToRedirect) {
    redirect(
      `/courses/${slug}/${lessonToRedirect.moduleId}/lesson/${lessonToRedirect.id}`,
    );
  }

  return <Skeleton className="flex-1" />;
}
