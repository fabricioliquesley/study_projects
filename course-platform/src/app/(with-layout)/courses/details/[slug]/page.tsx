import { getCourseBySlug } from "@/actions/courses";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration, formatLevel } from "@/lib/utils";
import {
  Calendar,
  Camera,
  ChartColumnDecreasing,
  CirclePlay,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CourseProgress } from "@/components/pages/course-progress";
import { BackButton } from "@/components/shared/back-button";

interface DetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);

  if (!course) {
    return notFound();
  }

  const durationInMs = course.modules.reduce((total, module) => {
    return (
      total +
      module.lessons.reduce((total, lesson) => {
        return total + lesson.durationInMs;
      }, 0)
    );
  }, 0);

  const totalLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.length;
  }, 0);

  const details = [
    {
      icon: Clock,
      label: "Duration",
      value: formatDuration(durationInMs),
    },
    {
      icon: Camera,
      label: "Lessons",
      value: `${totalLessons} lessons`,
    },
    {
      icon: ChartColumnDecreasing,
      label: "Difficulty",
      value: formatLevel(course.level),
    },
    {
      icon: Calendar,
      label: "Release Date",
      value: format(course.createdAt, "dd/MM/yyyy"),
    },
  ];

  return (
    <section className="flex flex-col">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <BackButton />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            {course.title}
          </h1>
          {course.description && (
            <p className="text-muted-foreground mt-1">{course.description}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {course.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={"outline"}
                className="border-primary bg-primary/10 text-primary max-w-max gap-1"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Image
          src={course.thumbnailUrl || ""}
          alt={course.title}
          width={300}
          height={400}
          className="border-primary aspect-video w-full rounded-2xl border object-cover sm:w-auto"
        />
      </div>

      <Separator className="my-6" />

      <div className="grid w-full gap-6 md:grid-cols-[1fr_400px]">
        <Tabs defaultValue="overview">
          <TabsList className="w-full md:max-w-[300px]">
            <TabsTrigger
              className="dark:data-[state=active]:text-primary"
              value="overview"
            >
              <LayoutDashboard />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="dark:data-[state=active]:text-primary"
            >
              <CirclePlay />
              Content
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="mt-4 opacity-90">{course.description}</p>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-6">
              {details.map((courseDetails) => (
                <div
                  key={courseDetails.label}
                  className="flex items-center gap-2"
                >
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <courseDetails.icon size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {courseDetails.label}
                    </p>
                    <p>{courseDetails.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="content" className="mt-4 flex flex-col gap-6">
            {course.modules.map((mod, index) => (
              <div
                key={mod.id}
                className="bg-muted flex items-center gap-4 rounded-2xl p-4"
              >
                <div className="border-primary text-primary bg-primary/10 flex h-12 w-12 min-w-12 items-center justify-center rounded-full border-2 text-2xl font-bold">
                  {index + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold sm:text-xl">{mod.title}</p>
                    <Badge variant={"outline"}>
                      {mod.lessons.length} lesson
                      {mod.lessons.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                  {!!mod.description && (
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <CourseProgress course={course} />
      </div>
    </section>
  );
}
