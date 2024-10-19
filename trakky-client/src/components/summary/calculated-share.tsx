import { useEffect, useState } from 'react';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { Owner } from '@/models/dtos';
import { Share } from '@/models/share';
import getDebitorBalances from '@/lib/calculators';
import { formatAmount } from '@/lib/text-formatter';
import { twMerge } from 'tailwind-merge';
import { DebitorBalance, OwedBalance } from '@/models/debitor-balance';
import { AnimateNumber } from './summary';
import { Dictionary } from '../ui/table/icons';
import PayDebitDialog from '../ui/table/pay-debit-popup';
import DebitOverview from './debit-overview';
import { FadeRight } from '../ui/animations/fade';

interface CalculatedShareAccordionProps {
  balances: Dictionary<number>;
  selectedCategory: string;
  onDebitCleared: () => void;
  showPayDebitButton: boolean;
  date: Date | null;
  checkBoxStates: Dictionary<boolean>;
  setCheckboxStates: (states: Dictionary<boolean>) => void;
}

export default function CalculatedShareAccordion({
  balances,
  selectedCategory,
  onDebitCleared,
  showPayDebitButton,
  date,
  checkBoxStates,
  setCheckboxStates,
}: CalculatedShareAccordionProps) {
  const [share, setShare] = useState<Share>();
  const [accordionIsDisabled, setAccordionIsDisabled] = useState<boolean>(true);
  const [owners, setOwners] = useState<Owner[]>([]);

  useEffect(() => {
    setShare(getDebitorBalances(balances));

    const controller = new AbortController();
    const { signal } = controller;

    Client.Get(Endpoint.Owners, signal).then(({ data }) => {
      const users = data as Owner[];
      setOwners(users);

      if (checkBoxStates && Object.keys(checkBoxStates).length === 0) {
        const checkBoxes: Dictionary<boolean> = {};
        users.forEach((owner) => {
          checkBoxes[owner.name] = true;
        });

        checkBoxes.All = true;

        setCheckboxStates(checkBoxes);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, checkBoxStates]);

  useEffect(() => {
    setAccordionIsDisabled(share?.debitorBalances.length === 0);
  }, [share]);

  useEffect(() => {
    const newBalances: Dictionary<number> = {};

    if (checkBoxStates.All) {
      Object.keys(balances).forEach((balance) => {
        newBalances[balance] = balances[balance];
      });

      owners.forEach((owner) => {
        if (!(owner.name in balances)) {
          newBalances[owner.name] = 0;
        }
      });
    } else {
      Object.keys(checkBoxStates).forEach((user) => {
        if (checkBoxStates[user] === true) {
          newBalances[user] = balances[user] ?? 0;
        }
      });
    }

    setShare(getDebitorBalances(newBalances));
  }, [balances, owners, checkBoxStates]);

  async function onConfirm(id: number) {
    if (!share) return;

    const newBalances: DebitorBalance[] = [];

    share.debitorBalances.forEach((debitor) => {
      const newBalance: OwedBalance[] = [];
      debitor.owed.forEach((owed) => {
        if (owed.id !== id) {
          newBalance.push(owed);
        }
      });

      if (newBalance.length > 0) {
        newBalances.push({
          owed: newBalance,
          name: debitor.name,
        });
      }
    });

    const newShare: Share = {
      totalAmount: share.totalAmount,
      shareAmount: share.shareAmount,
      debitorBalances: newBalances,
    };

    setShare(newShare);

    onDebitCleared();
  }

  return (
    <div>
      {share && (
        <>
          <div className="flex flex-row gap-2 mt-4 mx-1">
            <span className="min-w-[140px] text-base text-muted-foreground">
              Total Amount:
            </span>
            <div className="flex flex-row w-32 align-middle justify-between gap-2 text-base font-thin text-muted-foreground">
              <div>£</div>
              <div className="">
                <AnimateNumber
                  amount={share.totalAmount}
                  formatter={formatAmount}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 mx-1 mb-4">
            <span className="min-w-[140px] text-base text-muted-foreground">
              User Share:
            </span>
            <div className="flex flex-row w-32 align-middle justify-between gap-2 text-base font-thin text-muted-foreground">
              <div>£</div>
              <div className="">
                <AnimateNumber
                  amount={share.shareAmount}
                  formatter={formatAmount}
                />
              </div>
            </div>
          </div>
        </>
      )}
      {accordionIsDisabled && (
        <div className="flex flex-row gap-2 justify-start mx-1 my-4">
          <span className="min-w-[90px] text-muted-foreground">
            No outstanding debits
          </span>
        </div>
      )}
      {share?.debitorBalances.map((debitor, debitorIndex) => {
        const isLastDebitor = share.debitorBalances.length - 1 === debitorIndex;
        const maxDigits = share.debitorBalances[0].owed[0].toString().length;
        return debitor.owed.map((owed, owedIndex) => {
          const isLastTransaction = debitor.owed.length - 1 === owedIndex;

          return (
            <FadeRight key={`${debitor.name}-${owed.to}-debit`}>
              <DebitOverview
                maxDigits={maxDigits}
                debitorName={debitor.name}
                owed={owed}
              >
                {selectedCategory &&
                selectedCategory !== 'All' &&
                showPayDebitButton &&
                date ? (
                  <PayDebitDialog
                    date={date}
                    owed={owed}
                    category={selectedCategory}
                    onConfirm={() => onConfirm(owed.id)}
                    debitorName={debitor.name}
                    tooltipText="Clear Debit"
                    className={twMerge(
                      'rounded-none',
                      isLastDebitor && isLastTransaction && 'rounded-br'
                    )}
                  />
                ) : undefined}
              </DebitOverview>
            </FadeRight>
          );
        });
      })}
      {(!showPayDebitButton ||
        !selectedCategory ||
        selectedCategory === 'All') && (
        <div className="flex flex-row mt-2 mx-1 justify-center text-accent">
          Select valid month and category to clear debits
        </div>
      )}
    </div>
  );
}
