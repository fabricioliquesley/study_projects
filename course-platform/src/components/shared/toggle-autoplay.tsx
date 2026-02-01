"use client";

import { usePreferencesStore } from "@/stores/preferences";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function ToggleAutoplay() {
  const { autoplay, setAutoplay } = usePreferencesStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          <span className="block text-xs sm:hidden">Autoplay</span>
          <Switch
            checked={autoplay}
            onCheckedChange={(checked) => setAutoplay(checked)}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>enable/disable autoplay</p>
      </TooltipContent>
    </Tooltip>
  );
}
