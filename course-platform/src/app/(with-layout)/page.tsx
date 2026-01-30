import { CoursesList } from "@/components/pages/courses-list";
import { CoursesTagsList } from "@/components/pages/courses-tags-list";

interface HomeProps {
  searchParams: Promise<{
    query: string;
    tags: string | string[];
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { query, tags } = await searchParams;

  return (
    <div>
      <CoursesTagsList />

      <CoursesList query={query} tags={tags} />
    </div>
  );
}
