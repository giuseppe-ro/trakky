import Link from "next/link";

import { cn } from "@/lib/utils";
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href={"/"}
        className="text-sm font-medium transition-colors focus:outline-none"
      >
        Overview
      </Link>
      <Link
          href={"/dashboard/"}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none"
      >
        Dashboard
      </Link>
      <Link
        href={"/expenses/"}
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-slate-600 focus:outline-none"
      >
        Expenses
      </Link>
    </nav>
  );
}
