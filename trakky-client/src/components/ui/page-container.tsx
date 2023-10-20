import React from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:container px-2 md:px-6 mx-auto w-full">{children}</div>
  );
}
