import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";

export function PaymentPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border-green-700" variant="outline">
          Add New
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" rounded-xl p-0 m-0">
        <PaymentForm></PaymentForm>
      </PopoverContent>
    </Popover>
  );
}
