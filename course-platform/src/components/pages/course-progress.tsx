"use client";

import { Course } from "@/@types/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { Play, ShoppingCart } from "lucide-react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getCourseProgress } from "@/actions/course-progress";

interface CourseProgressProps {
  course: Course;
}

export const CourseProgress = ({ course }: CourseProgressProps) => {
  const hasCourse = true;

  const { data: courseProgress } = useQuery({
    queryKey: queryKeys.courseProgress(course.slug),
    queryFn: () => getCourseProgress(course.slug),
    enabled: !!course.slug && hasCourse,
  });

  const progress = courseProgress?.progress ?? 0;

  return (
    <aside className="bg-muted sticky top-0 max-h-max rounded-2xl p-6">
      {hasCourse ? (
        <>
          <h3 className="text-muted-foreground text-sm font-bold">
            Course Progress
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <Progress value={progress} />
            <p className="text-xs">{progress}%</p>
          </div>

          <Link href={`/courses/${course.slug}`}>
            <Button className="mt-4 h-auto w-full py-3 text-xl font-bold text-white">
              {progress > 0 ? "Continue" : "Start Learning"}
              <Play />
            </Button>
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-bold">Start now for only</p>
          {!!course.discountPrice && (
            <p className="text-muted-foreground font-medium line-through">
              {formatPrice(course.price)}
            </p>
          )}

          <p className="text-primary text-4xl font-extrabold">
            {formatPrice(course.discountPrice || course.price)}
          </p>

          <Button className="mt-2 h-auto w-full py-3 text-xl font-bold text-white">
            Buy now
            <ShoppingCart />
          </Button>
        </div>
      )}
    </aside>
  );
};
