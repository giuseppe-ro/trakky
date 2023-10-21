import React from "react";
import { demoMode } from "@/constants.ts";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:container px-2 pb-2 md:px-6 md:pb-2 mx-auto w-full">
      <>
        {demoMode && (
          <p className="mt-2 text-destructive italic">
            Demo mode. No data will be saved.
          </p>
        )}
        {children}
      </>
    </div>
  );
}
