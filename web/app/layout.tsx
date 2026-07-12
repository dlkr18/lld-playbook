import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLD Playbook - Master Low-Level Design",
  description: "Complete 4-week LLD curriculum with 44 real-world problems. Learn design patterns, SOLID principles, and system design.",
  keywords: ["low-level design", "system design", "design patterns", "SOLID", "software engineering"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-gray-800 py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>LLD Playbook - Master Low-Level Design</p>
            <p className="text-sm mt-2">Built with Next.js · Deployed on Vercel</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
