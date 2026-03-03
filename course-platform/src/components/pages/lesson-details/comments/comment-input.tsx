"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLessonComment } from "@/actions/course-comments";
import { queryKeys } from "@/constants/query-keys";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment cannot be longer than 500 characters"),
});

type FormData = z.infer<typeof commentSchema>;

export function CommentInput() {
  const params = useParams();

  const courseSlug = params.slug as string;
  const lessonId = params.lessonId as string;

  const queryClient = useQueryClient();

  const { user } = useUser();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: createLessonComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonComments(lessonId),
      });

      reset();

      toast.success("Comment created successfully");
    },
    onError: () => {
      toast.error("Failed to create comment");
    },
  });

  const onSubmit = (data: FormData) => {
    createComment({
      courseSlug,
      lessonId,
      content: data.content,
      parentId: undefined,
    });
  };

  return (
    <form className="flex gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Avatar src={user?.imageUrl || ""} fallback={user?.fullName || ""} />

      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Leave your comment"
            className="min-h-[100px]"
          />
        )}
      />
      <Button type="submit" disabled={isPending}>
        Post Comment
      </Button>
    </form>
  );
}
