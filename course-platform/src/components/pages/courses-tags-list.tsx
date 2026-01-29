import { getTags } from "@/actions/get-tags";
import { TagItem } from "./tag-item";
import { DraggableScroll } from "../shared/draggable-scroll";

export async function CoursesTagsList() {
  const tags = await getTags();

  const sortedTags = tags.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DraggableScroll className="scroll-hidden flex w-full gap-2 overflow-auto mask-r-from-80% pr-28 select-none">
      {sortedTags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
    </DraggableScroll>
  );
}
