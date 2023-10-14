import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/ui/main-nav";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trakky",
  description: "A personal expenses tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="sticky top-0 bg-gray-950">
          <div className="flex-col md:flex">
            <div className="border-b">
              <div className="flex h-16 items-center px-4 mx-6">
                <MainNav
                  className="h-8 sticky top-0 shadow-amber-700"
                  style={{ zIndex: 999 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-screen flex-col items-center justify-between overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
