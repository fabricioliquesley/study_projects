import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../ui/sidebar";
import Logo from "@/assets/logo.svg";
import LogoIcon from "@/assets/logo-icon.svg";
import { NavItems } from "./nav-items";
import { NavUser } from "./nav-user";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <Link href="/">
          <Logo className="mx-auto w-full max-w-[150px] pt-3 group-data-[state=expanded]:block sm:hidden" />
          <LogoIcon className="mx-auto hidden w-full max-w-[20px] pt-3 group-data-[state=collapsed]:block" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavItems />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
