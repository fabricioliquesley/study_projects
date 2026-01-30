"use client";

import { AppSidebar } from "@/components/shared/app-sidebar";
import { SignInButton } from "@/components/shared/app-sidebar/sign-in-button";
import { SearchInput } from "@/components/shared/search-input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isCoursePage = /^\/courses\/(?!details\/).+/.test(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className={cn(
            "flex h-[70px] shrink-0 items-center justify-between gap-2 border-b px-6",
            !isHomePage && "md:hidden",
          )}
        >
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="-ml-1 flex md:hidden" />
            {isHomePage && (
              <Suspense>
                <SearchInput />
              </Suspense>
            )}
          </div>
          <SignInButton />
        </header>
        <main
          className={cn(
            "flex flex-1 flex-col gap-6 overflow-auto p-6",
            isCoursePage && "p-0",
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
