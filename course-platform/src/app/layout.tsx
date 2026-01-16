import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
// import { ptBR } from "@clerk/localizations";

import "@/styles/globals.css";

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
    <ClerkProvider appearance={{ theme: shadcn }}>
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
