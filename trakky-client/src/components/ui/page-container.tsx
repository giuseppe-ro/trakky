import React from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:container px-2 pb-2 md:px-6 md:pb-2 mx-auto w-full min-w-[400px]">
      <>
        {children}
      </>
    </div>
  );
}
