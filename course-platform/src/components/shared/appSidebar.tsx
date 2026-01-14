import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <Link href="/">
          <p>LOGO</p>
        </Link>
      </SidebarHeader>
      <SidebarContent>{/* NAV ITEMS */}</SidebarContent>
      <SidebarFooter>{/* FOOTER */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
