"use client";

import { LessonCommentWithUserAndReplies } from "@/@types/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatName } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageSquareQuote, Trash } from "lucide-react";
import { useState } from "react";
import { CommentInput } from "./comment-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/actions/course-comments";
import { queryKeys } from "@/constants/query-keys";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

type CommentItemProps = {
  comment: LessonCommentWithUserAndReplies;
  className?: string;
  parentCommentId?: string;
  canReply?: boolean;
};

export function CommentItem({
  comment,
  className,
  parentCommentId,
  canReply = true,
}: CommentItemProps) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();

  const isAdmin = currentUser?.publicMetadata?.role === "admin";
  const user = comment.user;

  const authorName = formatName(user.firstName, user.lastName);
  const createdDateToNow = formatDistanceToNow(comment.createdAt, {
    addSuffix: true,
  });

  const [isReplying, setIsReplying] = useState(false);

  const { mutate: handleDeleteComment, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonComments(comment.lessonId),
      });

      toast.success("comment successfully deleted");
    },
    onError: () => toast.error("Error deleting comment"),
  });

  const canDelete = comment.user.clerkUserId === currentUser?.id || isAdmin;

  const actions = [
    {
      label: "Delete",
      icon: Trash,
      onclick: () => handleDeleteComment(),
      hidden: !canDelete,
      disabled: isDeleting,
    },
    {
      label: "Reply",
      icon: MessageSquareQuote,
      onclick: () => setIsReplying(true),
      hidden: !canReply,
      disabled: false,
    },
  ];

  const replies = comment.commentReplies ?? [];

  return (
    <div
      className={cn(
        "bg-card group flex flex-col gap-3 rounded-lg p-4 text-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar src={user.imageUrl} fallback={authorName} />
          <p>{authorName}</p>
          <span className="text-muted-foreground text-xs">
            {createdDateToNow}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions.map((action) => {
            if (action.hidden) return null;

            return (
              <Tooltip key={`comment-${comment.id}-action-${action.label}`}>
                <TooltipTrigger asChild>
                  <Button
                    className="opacity-0 group-hover:opacity-100"
                    onClick={action.onclick}
                    variant={"outline"}
                    size={"icon"}
                  >
                    <action.icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{action.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <p className="text-muted-foreground">{comment.content}</p>

      {!!replies.length && (
        <div className="flex flex-col gap-2 pl-4">
          {replies.map((reply, index) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              parentCommentId={comment.id}
              className="bg-muted p-3"
              canReply={index === replies.length - 1}
            />
          ))}
        </div>
      )}

      {isReplying && (
        <CommentInput
          parentCommentId={parentCommentId ?? comment.id}
          autoFocus
          onCancel={() => setIsReplying(false)}
          onSuccess={() => setIsReplying(false)}
          className="bg-muted flex-col rounded-lg p-4 sm:flex-row"
        />
      )}
    </div>
  );
}
