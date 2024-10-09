import {
  allMatches,
  formatCurrency,
  getDebitorBalances,
  Share,
} from '@/lib/formatter';
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { Owner } from '@/models/dtos';
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
  const [usersWithoutTransactions, setUsersWithoutTransactions] =
    useState<boolean>(false);
  const [owners, setOwners] = useState<Owner[]>([]);

  const [showUsers, setShowUsers] = useState<Dictionary<boolean>>({});
  const [showAllUsers, setShowAllUsers] = useState<boolean>(true);

  useEffect(() => {
    setShare(getDebitorBalances(balances));

    const controller = new AbortController();
    const { signal } = controller;

    Client.Get(Endpoint.Owners, signal).then(({ data }) => {
      const users = data as Owner[];
      setOwners(users);
    });
  }, [balances]);

  useEffect(() => {
    const users: Dictionary<boolean> = {};

    if (Object.keys(showUsers).length === 0) {
      owners.forEach((owner) => {
        users[owner.name] = true;
      });
    }

    setShowUsers(users);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owners]);

  useEffect(() => {
    setUsersWithoutTransactions(owners.length !== Object.keys(balances).length);
  }, [owners, balances]);

  useEffect(() => {
    setAccordionIsDisabled(share?.debitorBalances.length === 0);
  }, [share]);

  useEffect(() => {
    const newBalances: Dictionary<number> = {};

    if (showAllUsers) {
      Object.keys(balances).forEach((balance) => {
        newBalances[balance] = balances[balance];
      });

      owners.forEach((owner) => {
        if (!(owner.name in balances)) {
          newBalances[owner.name] = 0;
        }
      });
    } else {
      Object.keys(showUsers).forEach((user) => {
        if (showUsers[user] === true) {
          newBalances[user] = balances[user] ?? 0;
        }
      });
    }

    setShare(getDebitorBalances(newBalances));
  }, [showAllUsers, balances, owners, showUsers]);

  async function setCheckBox(key: string) {
    const users: Dictionary<boolean> = {};

    Object.keys(showUsers).forEach((user) => {
      users[user] = showUsers[user];
    });

    if (key === 'All') {
      Object.keys(showUsers).forEach((user) => {
        users[user] = !showAllUsers;
      });
      setShowAllUsers(!showAllUsers);
    } else {
      const newState = !users[key];
      users[key] = newState;

      if (newState === true && allMatches(users, newState)) {
        setShowAllUsers(newState);
      } else {
        setShowAllUsers(false);
      }
    }

    setShowUsers(users);
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger
          className="justify-center gap-2 pb-2 text-sm bg-transparent text-slate-500"
          disabled={accordionIsDisabled && !usersWithoutTransactions}
        >
          {accordionIsDisabled && !usersWithoutTransactions
            ? 'No Expenses To Share'
            : 'Share Expenses'}
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
                    checked={showAllUsers}
                    onClick={() => {
                      setCheckBox('All');
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
                        checked={showUsers[owner.name]}
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
            {share && !accordionIsDisabled && !usersWithoutTransactions && (
              <div className="flex flex-row gap-2 justify-start mx-1 my-4">
                <span className="min-w-[90px] text-muted-foreground font-bold">
                  Share Per Person:
                </span>
                <div className="flex flex-row align-middle gap-2 text-xs font-thin text-muted-foreground">
                  <AnimateNumber
                    amount={share.amount}
                    formatter={formatCurrency}
                  />
                </div>
              </div>
            )}
            {share?.debitorBalances.map((debitor) => {
              return debitor.owed.map((owed) => {
                return (
                  <div className="flex m-1" key={`${debitor}-${owed.to}-debit`}>
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
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
