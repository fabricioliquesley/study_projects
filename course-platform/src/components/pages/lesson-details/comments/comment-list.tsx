"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getLessonComments } from "@/actions/course-comments";
import { CommentItem } from "./comment-item";

export function CommentList() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { data: comments } = useQuery({
    queryKey: queryKeys.lessonComments(lessonId),
    queryFn: () => getLessonComments(lessonId),
    enabled: !!lessonId,
  });

  return (
    <>
      {!comments ? (
        <Skeleton className="min-h-[200px] w-full" />
      ) : (
        <>
          {!comments.length && (
            <p className="text-muted-foreground mb-2 text-sm">
              No comments yet. Be the first to comment!
            </p>
          )}

          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
