import React, { useEffect } from "react";
import { toast } from "@/components/ui/use-toast.ts";
import { serverIsDown } from "@/infrastructure/healthcheck.ts";


export function PageContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  useEffect(() => {
    setTimeout(async () => {
      console.log("Checking server health")
      if (await serverIsDown()) {
        toast({
          variant: "destructive",
          title: "Server is down",
          description: "The server is down or not reachable.",
          duration: 5000,
        })
      }

    }, 1000);
  }, []);

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
