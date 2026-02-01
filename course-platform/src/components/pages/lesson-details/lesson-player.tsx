"use client";

import { Lesson } from "@/@types/types";
import { usePreferencesStore } from "@/stores/preferences";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./video-player"), {
  ssr: false,
});

interface LessonPlayerProps {
  lesson: Lesson;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const autoplay = usePreferencesStore((state) => state.autoplay);

  const videoId = lesson.videoId;

  return (
    <div key={videoId} className="aspect-video w-full overflow-hidden bg-black">
      <VideoPlayer videoId={videoId} autoplay={autoplay} />
    </div>
  );
}
