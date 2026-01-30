import { getCourseBySlug } from "@/actions/courses";
import { LessonDetails } from "@/components/pages/lesson-details";
import { TopDetails } from "@/components/pages/top-details";
import { notFound } from "next/navigation";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  return (
    <div className="grid h-screen w-full grid-cols-[1fr_auto] overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <TopDetails course={course} />

        <LessonDetails lesson={course.modules[0].lessons[0]} />
      </div>
    </div>
  );
}
