import { AppSidebar } from "@/components/shared/appSidebar";
import { SearchInput } from "@/components/shared/searchInput";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import Link from "next/link";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-[70px] shrink-0 items-center justify-between gap-2 border-b px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="-ml-1 flex md:hidden" />
            <SearchInput />
          </div>
          <Link href="/auth/sign-in">
            <Button size="sm">
              <LogIn />
              Sign In
            </Button>
          </Link>
        </header>
        <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
