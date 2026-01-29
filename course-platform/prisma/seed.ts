import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import sampleCourses from "./sample-courses.json";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  for (const course of sampleCourses) {
    const { tags, modules, ...data } = course;

    const createdCourse = await prisma.course.create({
      data: {
        ...course,
        status: "PUBLISHED",
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        modules: {
          create: modules.map((courseModule, index) => ({
            title: courseModule.title,
            description: courseModule.description,
            order: index + 1,
            lessons: {
              create: courseModule.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title,
                description: lesson.description,
                videoId: lesson.videoId,
                durationInMs: lesson.durationInMs,
                order: lessonIndex + 1,
              })),
            },
          })),
        },
      },
    });

    console.log(`Created course: ${createdCourse.title}`);
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
