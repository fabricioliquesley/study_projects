import { AppSidebar } from "@/components/shared/app-sidebar";
import { SignInButton } from "@/components/shared/app-sidebar/sign-in-button";
import { SearchInput } from "@/components/shared/search-input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
          <SignInButton />
        </header>
        <main className="flex flex-1 flex-col gap-6 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
