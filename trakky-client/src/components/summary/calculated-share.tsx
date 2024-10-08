import {
  DebitorBalance,
  formatCurrency,
  getDebitorBalances,
} from '@/lib/formatter';
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { OwnerBalance } from '@/models/owner-balance';
import { AnimateNumber } from './summary';

interface CalculatedShareAccordionProps {
  balances: OwnerBalance[];
}

export default function CalculatedShareAccordion({
  balances,
}: CalculatedShareAccordionProps) {
  const [debitorBalances, setDebitorBalances] = useState<DebitorBalance[]>([]);
  const [accordionIsDisabled, setAccordionIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDebitorBalances(getDebitorBalances(balances));
  }, [balances]);

  useEffect(() => {
    setAccordionIsDisabled(debitorBalances.length === 0);
  }, [debitorBalances]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="justify-center gap-2 pb-2 text-sm bg-transparent text-slate-500"
          disabled={accordionIsDisabled}
        >
          {accordionIsDisabled ? 'No Debits To Show' : 'Show Debits'}
        </AccordionTrigger>
        <AccordionContent>
          {debitorBalances?.map((debitor) => {
            return debitor.owed.map((owed) => {
              return (
                <div
                  className="flex m-1"
                  key={`${owed.to}-${owed.amount}-${debitor.name}-${debitor.owed}-debit`}
                >
                  <div className="min-w-[100px] text-muted-foreground font-bold">
                    {debitor.name}:
                  </div>
                  <div className="flex text-muted-foreground">
                    Owes
                    <div className="mx-1">
                      <AnimateNumber
                        amount={owed.amount}
                        formatter={formatCurrency}
                      />
                    </div>
                    to {owed.to}
                  </div>
                </div>
              );
            });
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
