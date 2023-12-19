import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import React from "react";

export function PopupDialog({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2">{children}</DialogContent>
    </Dialog>
  );
}
