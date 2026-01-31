import type { CourseModuleWithLessons } from "@/@types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ModuleItem } from "./module-item";

interface ModulesListProps {
  modules: CourseModuleWithLessons[];
}

export function ModulesList({ modules }: ModulesListProps) {
  return (
    <aside className="border-border bg-sidebar min- relative h-full max-w-[380px] min-w-[380px] overflow-x-hidden overflow-y-auto border-l p-4 transition-all">
      <div className="group absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start">
        <div className="group-hover:bg-sidebar-border h-full w-0.5 transition-all" />
      </div>

      <Accordion.Root
        type="single"
        className="flex h-full w-full flex-col gap-3"
        collapsible
      >
        {modules.map((courseModule) => (
          <ModuleItem key={courseModule.id} courseModule={courseModule} />
        ))}
      </Accordion.Root>
    </aside>
  );
}
