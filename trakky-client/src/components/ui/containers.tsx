import React from "react";

export function PageContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`md:container px-0 pb-2 md:px-12 mx-auto w-full ${className}`}>
      <>
        {children}
      </>
    </div>
  );
}

export function Containers({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`px-2 md:px-0 ${className}`}>
        {children}
    </div>
  );
}
