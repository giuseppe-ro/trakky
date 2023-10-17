import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";

export function NewPaymentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-green-800 hover:bg-green-800"
        >
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2">
        <PaymentForm></PaymentForm>
      </DialogContent>
    </Dialog>
  );
}
