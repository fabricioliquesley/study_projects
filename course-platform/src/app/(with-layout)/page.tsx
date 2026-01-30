import { CoursesList } from "@/components/pages/courses-list";
import { CoursesTagsList } from "@/components/pages/courses-tags-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<{
    query: string;
    tags: string | string[];
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { query, tags } = await searchParams;

  const suspenseKey = `${query}-${tags}`;

  return (
    <div className="h-full">
      <Suspense
        key={`tags-${suspenseKey}`}
        fallback={<Skeleton className="h-[22px] min-h-[22px] w-full" />}
      >
        <CoursesTagsList />
      </Suspense>

      <Suspense
        key={suspenseKey}
        fallback={<Skeleton className="mt-6 h-full" />}
      >
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </div>
  );
}
