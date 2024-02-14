import React from 'react';

import { PopupDialog } from '@/components/ui/table/popup-dialog';
import { Button } from '@/components/ui/button';
import { FilePenLine } from 'lucide-react';

export function EditCell({
  id,
  children,
}: {
  id: string | number | undefined;
  children: React.ReactNode;
}) {
  return (
    <PopupDialog
      trigger={
        <Button
          type="submit"
          key={id}
          variant="outline"
          className="bg-transparent hover:bg-transparent p-0 mx-1 my-0 h-5 border-none hover:text-green-500"
        >
          <FilePenLine
            width={16}
            height={16}
            className="hover:text-green-500 text-green-500/50"
          />
        </Button>
      }
    >
      {children}
    </PopupDialog>
  );
}

export default EditCell;
