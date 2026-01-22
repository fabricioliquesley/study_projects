import { Header } from "@/components/header";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <main className="font-inter mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-(--grid-app) gap-5 p-8">
      <Header />
      {children}
    </main>
  );
}
