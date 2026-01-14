import { Separator } from "@/components/ui/separator";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  BookUp2,
  ChartArea,
  MessageCircle,
  SquareDashedBottomCode,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function NavItems() {
  const navItems: NavItem[] = [
    {
      label: "Courses",
      path: "/",
      icon: SquareDashedBottomCode,
    },
    {
      label: "My Courses",
      path: "/my-courses",
      icon: BookUp2,
    },
    {
      label: "Ranking",
      path: "/ranking",
      icon: Trophy,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      label: "Statistics",
      path: "/admin",
      icon: ChartArea,
    },
    {
      label: "Manager Courses",
      path: "/admin/courses",
      icon: BookOpen,
    },
    {
      label: "Manager Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Manager Comments",
      path: "/admin/comments",
      icon: MessageCircle,
    },
  ];

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      return (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton asChild tooltip={item.label}>
            <Link href={item.path}>
              <Icon className="text-primary hover:text-primary transition-all group-data-[collapsible=icon]:text-white" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {renderNavItems(navItems)}
        <Separator className="my-2" />
        {renderNavItems(adminNavItems)}
      </SidebarMenu>
    </SidebarGroup>
  );
}
