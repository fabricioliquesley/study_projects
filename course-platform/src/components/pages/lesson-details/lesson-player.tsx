"use client";

import { Lesson } from "@/@types/types";
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./video-player"), {
  ssr: false,
});

interface LessonPlayerProps {
  lesson: Lesson;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  return (
    <div className="aspect-video w-full overflow-hidden bg-black">
      <VideoPlayer videoId={lesson.videoId} autoplay={false} />
    </div>
  );
}
