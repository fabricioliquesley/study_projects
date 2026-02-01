"use client";

import { usePreferencesStore } from "@/stores/preferences";
import { Button } from "../ui/button";
import { PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleModuleListCollapsedProps {
  className?: string;
}

export function ToggleModuleListCollapsed({
  className,
}: ToggleModuleListCollapsedProps) {
  const { modulesListCollapsed, setModulesListCollapsed } =
    usePreferencesStore();

  const handleToggleCollapsed = () =>
    setModulesListCollapsed(!modulesListCollapsed);

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      onClick={handleToggleCollapsed}
      className={cn("", className)}
    >
      <PanelRightOpen />
    </Button>
  );
}
