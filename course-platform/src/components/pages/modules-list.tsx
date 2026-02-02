"use client";

import type { CourseModuleWithLessons } from "@/@types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ModuleItem } from "./module-item";
import { usePreferencesStore } from "@/stores/preferences";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { PanelRightOpen } from "lucide-react";
import { ToggleModuleListCollapsed } from "../shared/toggle-module-list-collapsed";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCourseProgress } from "@/actions/course-progress";
import { queryKeys } from "@/constants/query-keys";

interface ModulesListProps {
  modules: CourseModuleWithLessons[];
}

export function ModulesList({ modules }: ModulesListProps) {
  const params = useParams();

  const moduleId = params.moduleId as string;
  const courseSlug = params.slug as string;

  const {
    expandedModule,
    setExpandedModule,
    modulesListCollapsed,
    setModulesListCollapsed,
  } = usePreferencesStore();

  const initialCollapsedIsSet = useRef(false);

  useEffect(() => {
    if (initialCollapsedIsSet.current) return;

    initialCollapsedIsSet.current = true;

    setModulesListCollapsed(window.innerWidth < 768);
  }, [setModulesListCollapsed]);

  const handleToggleCollapsed = () => {
    setModulesListCollapsed(!modulesListCollapsed);
  };

  const { data: courseProgress } = useQuery({
    queryKey: queryKeys.courseProgress(courseSlug),
    queryFn: () => getCourseProgress(courseSlug),
    enabled: !!courseSlug,
  });

  const completedLessons = courseProgress?.completedLessons ?? [];

  return (
    <aside
      className={cn(
        "border-border bg-sidebar min- relative h-full max-w-[380px] min-w-[380px] overflow-x-hidden overflow-y-auto border-l p-4 transition-all",
        !modulesListCollapsed &&
          "fixed top-0 right-0 bottom-0 z-10 sm:relative",
        modulesListCollapsed && "hidden w-16 max-w-16 min-w-16 sm:flex",
      )}
    >
      <div
        onClick={handleToggleCollapsed}
        className={cn(
          "group absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start",
          modulesListCollapsed && "cursor-w-resize",
        )}
      >
        <div className="group-hover:bg-sidebar-border h-full w-0.5 transition-all" />
      </div>

      {modulesListCollapsed ? (
        <ToggleModuleListCollapsed />
      ) : (
        <>
          <Button
            variant={"outline"}
            onClick={handleToggleCollapsed}
            className="mb-4 flex w-full sm:hidden"
          >
            Close modules
          </Button>
          <Accordion.Root
            type="single"
            className="flex h-full w-full flex-col gap-3"
            collapsible
            defaultValue={moduleId}
            value={expandedModule ?? undefined}
            onValueChange={setExpandedModule}
          >
            {modules.map((courseModule) => (
              <ModuleItem
                key={courseModule.id}
                courseModule={courseModule}
                completedLessons={completedLessons}
              />
            ))}
          </Accordion.Root>
        </>
      )}
    </aside>
  );
}
