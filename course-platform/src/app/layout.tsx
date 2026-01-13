import type { Metadata } from "next";
import { Nunito } from "next/font/google";
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
    <html lang="en">
      <body className={`${nunito.variable} font-nunito-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
