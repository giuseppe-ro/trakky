import React from "react";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="p-2 md:container mx-auto m-6 w-full">{children}</div>;
}
