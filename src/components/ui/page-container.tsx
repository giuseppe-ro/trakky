import React from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="md:container mx-auto w-full">{children}</div>;
}
