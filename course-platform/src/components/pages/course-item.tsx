interface CourseItemProps {
  title: string;
}

export function CourseItem({ title }: CourseItemProps) {
  return <p>{title}</p>;
}
