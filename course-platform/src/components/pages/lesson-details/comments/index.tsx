import { CommentInput } from "./comment-input";

export function LessonComments() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold">LessonComments</div>
      <CommentInput />
    </div>
  );
}
