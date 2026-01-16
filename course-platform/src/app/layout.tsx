import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
// import { ptBR } from "@clerk/localizations";

const nunito = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Course Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(nunito.variable, "font-nunito-sans dark antialiased")}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
