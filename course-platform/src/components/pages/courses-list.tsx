import { getCourses } from "@/actions/courses";
import { CourseItem } from "./course-item";

interface CourseListProps {
  query: string;
  tags: string | string[];
}

export async function CoursesList({ query, tags }: CourseListProps) {
  const courses = await getCourses({ query, tags });

  if (!courses) return;

  return (
    <section className="xl: mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </section>
  );
}
