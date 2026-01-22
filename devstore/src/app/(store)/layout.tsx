import { Header } from "@/components/header";
import { CartProvider } from "@/contexts/cart-context";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <CartProvider>
      <main className="font-inter mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-(--grid-app) gap-5 p-8">
        <Header />
        {children}
      </main>
    </CartProvider>
  );
}
