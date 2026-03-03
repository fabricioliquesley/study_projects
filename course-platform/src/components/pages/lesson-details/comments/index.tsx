import { CommentInput } from "./comment-input";
import { CommentList } from "./comment-list";

export function LessonComments() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-semibold">LessonComments</div>

      <CommentInput />
      <CommentList />
    </div>
  );
}
