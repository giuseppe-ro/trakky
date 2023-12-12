import React from "react";

export function SectionContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`md:container px-2 pb-2 md:px-6 md:pb-2 mx-auto w-full ${className}`}>
      <>
        {children}
      </>
    </div>
  );
}
