"use client";

import React from "react";
import { demoMode } from "@/constants.ts";
import { Github } from "lucide-react";

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
    { href: "/dashboards", label: "Dashboards" },
    { href: "/overview", label: "Overview" },
    { href: "/settings", label: "Settings" },
  ];


  return (
    <>
      <div className="sticky top-0 bg-gray-950 z-50">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex justify-between items-center">
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
              <a
                href="https://github.com/Joe85gr/trakky"
                className="cursor-pointer text-slate-600 hover:text-slate-500"
                target="_blank"
              >
                <Github className="mr-6 h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
        {children}
    </>
  );
}
