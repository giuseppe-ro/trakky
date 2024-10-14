import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint, StorageKey } from '@/constants';
import { Owner } from '@/models/dtos';
import { Share } from '@/models/share';
import getDebitorBalances from '@/lib/calculators';
import { formatAmount } from '@/lib/text-formatter';
import { twMerge } from 'tailwind-merge';
import { DebitorBalance, OwedBalance } from '@/models/debitor-balance';
import { AnimateNumber } from './summary';
import { Dictionary } from '../ui/table/icons';
import { Button } from '../ui/button';
import PayDebitDialog from '../ui/table/pay-debit-popup';
import DebitOverview from './debit-overview';

interface CalculatedShareAccordionProps {
  balances: Dictionary<number>;
  onRefresh: () => void;
}

export default function CalculatedShareAccordion({
  balances,
  onRefresh,
}: CalculatedShareAccordionProps) {
  const [share, setShare] = useState<Share>();
  const [accordionIsDisabled, setAccordionIsDisabled] = useState<boolean>(true);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [checkBoxStates, setCheckboxStates] = useState<Dictionary<boolean>>({});

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

    onRefresh();
  }

  async function setAllCheckBoxes() {
    const users: Dictionary<boolean> = {};

    const newState = !checkBoxStates.All;

    Object.keys(checkBoxStates).forEach((user) => {
      users[user] = newState;
    });

    setCheckboxStates(users);

    localStorage.setItem(StorageKey.ShowedUserShares, JSON.stringify(users));
  }

  function allCheckboxesOn(dictionary: Dictionary<boolean>, newState: boolean) {
    return (
      newState === true && Object.values(dictionary).every((e) => e === true)
    );
  }

  async function setCheckBox(key: string) {
    const users: Dictionary<boolean> = {};

    Object.keys(checkBoxStates).forEach((user) => {
      users[user] = checkBoxStates[user];
    });

    const newState = !users[key];

    users[key] = newState;

    const usersState: Dictionary<boolean> = {};

    Object.keys(users).forEach((user) => {
      if (user !== 'All') {
        usersState[user] = users[user];
      }
    });

    if (allCheckboxesOn(usersState, newState)) {
      users.All = true;
    } else {
      users.All = false;
    }

    setCheckboxStates(users);

    localStorage.setItem(StorageKey.ShowedUserShares, JSON.stringify(users));
  }

  const checkboxStyle = (isChecked: boolean) =>
    twMerge(
      'text-base font-normal h-9 transition-colors duration-300',
      isChecked
        ? 'bg-button-checkbox hover:bg-button-checkbox text-primary hover:text-primary hover:font-bold'
        : 'bg-background hover:bg-background text-muted-foreground/50 hover:text-muted-foreground'
    );

  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="justify-center gap-2 pb-2 text-sm bg-transparent">
          Share Expenses
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <div>
            <div className="flex flex-row gap-2 justify-start mx-1 my-4 align-middle">
              <span className="self-center min-w-[120px] text-base text-muted-foreground align-middle h-full">
                Calculate For:
              </span>
              <div className="flex flex-row flex-wrap align-middle gap-2">
                <Button
                  variant="outline"
                  className={checkboxStyle(checkBoxStates.All)}
                  onClick={() => {
                    setAllCheckBoxes();
                  }}
                >
                  All
                </Button>
                {owners.map((owner) => {
                  return (
                    <Button
                      key={owner.id}
                      variant="outline"
                      className={checkboxStyle(checkBoxStates[owner.name])}
                      onClick={() => {
                        setCheckBox(owner.name);
                      }}
                    >
                      {owner.name}
                    </Button>
                  );
                })}
              </div>
            </div>
            {share && !accordionIsDisabled && (
              <>
                <div className="flex flex-row gap-2 mx-1">
                  <span className="min-w-[140px] text-base text-muted-foreground">
                    Total:
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
                    Share Per User:
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
              const isLastDebitor =
                share.debitorBalances.length - 1 === debitorIndex;
              const maxDigits =
                share.debitorBalances[0].owed[0].toString().length;
              return debitor.owed.map((owed, owedIndex) => {
                const isLastTransaction = debitor.owed.length - 1 === owedIndex;

                return (
                  <DebitOverview
                    key={`${debitor.name}-${owed.to}-debit`}
                    maxDigits={maxDigits}
                    debitorName={debitor.name}
                    owed={owed}
                  >
                    <PayDebitDialog
                      owed={owed}
                      onConfirm={() => onConfirm(owed.id)}
                      debitorName={debitor.name}
                      tooltipText="Clear Debit"
                      className={twMerge(
                        'rounded-none',
                        isLastDebitor && isLastTransaction && 'rounded-br'
                      )}
                    />
                  </DebitOverview>
                );
              });
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
