import { PopupDialog } from "@/app/expenses/components/popup-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PenBoxIcon } from "lucide-react";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";
import { Payment } from "@/infrastructure/payment.tsx";

export function EditCell({
  payment,
  onPaymentEdited,
}: {
  payment: Payment;
  onPaymentEdited: () => void;
}) {
  return (
    <PopupDialog
      trigger={
        <Button
          key={payment.id}
          variant="outline"
          className="bg-transparent hover:bg-transparent p-0 mx-1 my-0 h-5 border-none hover:text-green-500"
        >
          <PenBoxIcon
            width={16}
            height={16}
            className="hover:text-green-500 text-green-500/50"
          ></PenBoxIcon>
        </Button>
      }
    >
      <PaymentForm
        editValues={payment}
        refresh={onPaymentEdited}
        title={"Edit Transaction"}
      ></PaymentForm>
    </PopupDialog>
  );
}
