"use client";

import React from "react";
import { demoMode } from "@/constants.ts";

interface Links {
  href: string;
  label: string;
}

export function MainNav({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const links: Links[] = [
    { href: "/", label: "Home" },
    { href: "/expenses", label: "Expenses" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <div className="sticky top-0 bg-gray-950 z-50 min-w-[400px]">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4 mx-6">
              <nav {...props}>
                {links.map((link, index) => {
                  return (
                    <a
                      key={index}
                      tabIndex={index}
                      href={link.href}
                      className={
                        window.location.pathname === link.href
                          ? "text-sm font-medium text-slate-200 transition-colors focus:outline-none"
                          : "text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none"
                      }
                    >
                      {link.label}
                    </a>
                  );
                })}
                {demoMode && (
                  <div className="text-sm font-medium text-destructive">
                    Demo mode
                  </div>
                )}
              </nav>

            </div>
          </div>

        </div>

      </div>

      {children}
    </>
  );
}
