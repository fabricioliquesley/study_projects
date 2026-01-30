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
    <div>
      {courses.map((course) => (
        <CourseItem key={course.id} title={course.title} />
      ))}
    </div>
  );
}
