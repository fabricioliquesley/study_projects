import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevRoast",
  description: "Paste your code. Get roasted.",
};

function Navbar() {
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-border-primary bg-bg-page px-10">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold text-accent-green">
          &gt;
        </span>
        <span className="font-mono text-lg font-medium text-text-primary">
          devroast
        </span>
      </Link>
      <Link
        href="/leaderboard"
        className="font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors"
      >
        leaderboard
      </Link>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} bg-bg-page font-mono text-text-primary antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
