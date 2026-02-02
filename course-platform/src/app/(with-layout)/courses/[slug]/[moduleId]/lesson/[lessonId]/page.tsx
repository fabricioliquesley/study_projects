import { getCourseBySlug } from "@/actions/courses";
import { LessonDetails } from "@/components/pages/lesson-details";
import { ModulesList } from "@/components/pages/modules-list";
import { TopDetails } from "@/components/pages/top-details";
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: Promise<{
    slug: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug, moduleId, lessonId } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const currentModule = course.modules.find((module) => module.id === moduleId);

  if (!currentModule) notFound();

  const allLessons = course.modules.flatMap((mod) => mod.lessons);

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === lessonId,
  );

  const currentLesson = allLessons[currentLessonIndex];
  const nextLesson = allLessons[currentLessonIndex + 1];

  if (!currentLesson) notFound();

  return (
    <div className="grid h-screen w-full grid-cols-[1fr_auto] overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <TopDetails course={course} />

        <LessonDetails lesson={currentLesson} nextLesson={nextLesson} />
      </div>

      <ModulesList modules={course.modules} />
    </div>
  );
}
