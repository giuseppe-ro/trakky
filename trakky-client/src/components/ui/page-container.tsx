import React from "react";
import { demoMode } from "@/constants.ts";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:container p-2 md:p-6 mx-auto w-full">
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
