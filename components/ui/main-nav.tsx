"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

interface Links {
  href: string;
  label: string;
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const links: Links[] = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/expenses", label: "Expenses" },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link, index) => {
        return (
          <Link
            key={index}
            href={link.href}
            className={
              usePathname() === link.href
                ? "text-sm font-medium text-slate-200 transition-colors focus:outline-none"
                : "text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
