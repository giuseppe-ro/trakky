import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';

export function PopupDialog({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger
        className="outline-none focus-visible:outline-none"
        asChild
      >
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2 focus-visible:outline-none">
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default PopupDialog;
