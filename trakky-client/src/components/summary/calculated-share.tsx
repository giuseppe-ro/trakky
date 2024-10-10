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
import { formatCurrency } from '@/lib/text-formatter';
import Checkbox from '../ui/checkbox';
import { AnimateNumber } from './summary';
import { Dictionary } from '../ui/table/icons';

interface CalculatedShareAccordionProps {
  balances: Dictionary<number>;
}

export default function CalculatedShareAccordion({
  balances,
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

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="justify-center gap-2 pb-2 text-sm bg-transparent text-slate-500">
          Share Expenses
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <div>
            <div className="flex flex-row gap-2 justify-start mx-1 my-4">
              <span className="min-w-[90px] text-muted-foreground font-bold">
                Calculate For:
              </span>
              <div className="flex flex-row align-middle gap-2 text-xs font-thin text-muted-foreground">
                <div
                  key="all"
                  className="flex flex-row align-middle gap-1 text-xs font-thin text-muted-foreground"
                >
                  <Checkbox
                    id="include-all"
                    checked={checkBoxStates.All}
                    onClick={() => {
                      setAllCheckBoxes();
                    }}
                  />
                  All
                </div>
                {owners.map((owner) => {
                  return (
                    <div
                      key={owner.id}
                      className="flex flex-row align-middle gap-1 text-xs font-thin text-muted-foreground"
                    >
                      <Checkbox
                        id="include-all"
                        checked={checkBoxStates[owner.name]}
                        onClick={() => {
                          setCheckBox(owner.name);
                        }}
                      />
                      {owner.name}
                    </div>
                  );
                })}
              </div>
            </div>
            {share && (
              <>
                <div className="flex flex-row gap-2 justify-start mx-1 mt-4">
                  <span className="w-[100px] text-muted-foreground font-bold">
                    Total:
                  </span>
                  <div className="flex flex-row align-middle gap-2 text-xs font-thin text-muted-foreground">
                    <AnimateNumber
                      amount={share.totalAmount}
                      formatter={formatCurrency}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2 justify-start mx-1 mb-4">
                  <span className="w-[100px] text-muted-foreground font-bold">
                    Share Per User:
                  </span>
                  <div className="flex flex-row align-middle gap-2 text-xs font-thin text-muted-foreground">
                    <AnimateNumber
                      amount={share.shareAmount}
                      formatter={formatCurrency}
                    />
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
            {share?.debitorBalances.map((debitor) => {
              return debitor.owed.map((owed) => {
                return (
                  <div
                    className="flex mx-1 border-b gap-2"
                    key={`${debitor}-${owed.to}-debit`}
                  >
                    <div className="w-[100px]">
                      <div className="w-[100px] overflow-x-scroll h-5 text-muted-foreground text-nowrap font-bold no-scrollbar">
                        {debitor.name}
                      </div>
                    </div>
                    <div className="flex text-muted-foreground text-xs font-thin">
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
