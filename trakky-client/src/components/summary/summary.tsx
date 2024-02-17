'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@tanstack/react-table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FadeLeft } from '@/components/ui/animations/fade';
import React from 'react';
import { getPercentageChangeText } from '@/lib/formatter';
import { Total } from '@/models/total';
import {
  getTotalForDate,
  getPreviousYearTotal,
  calculatePercentageDiff,
} from './calculators';

interface SummaryCardProps {
  title: string;
  contentText?: string;
  contentSubText?: string;
  children?: React.ReactNode;
}

function SummaryCard({
  title,
  contentText,
  contentSubText,
  children,
}: SummaryCardProps) {
  return (
    <Card className="border rounded-xl p-1 md:p-4 h-[130px] md:h-[150px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:p-4">
        <div className="text-xl md:text-2xl font-bold">{contentText}</div>
        <div className="text-xs text-muted-foreground">
          {contentSubText}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

SummaryCard.defaultProps = {
  contentText: '',
  contentSubText: '',
  children: null,
};

function formatCurrency(total: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(total);
}

type OwnerBalance = {
  owner: string;
  amount: number;
  difference?: string;
};

export function Summary<TData>({
  table,
  totalsPerYear,
  selectedYear,
}: {
  table: Table<TData>;
  totalsPerYear: Total[];
  selectedYear: string;
}) {
  const totalAmounts: number[] = table
    .getPreFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')));

  const totalAmount = totalAmounts.reduce(
    (total, currentAmount) => total + currentAmount,
    0
  );

  const partialTotal: number = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')))
    .reduce((total, currentAmount) => total + currentAmount, 0);

  const currentDate = new Date();
  const lastYearCurrentMonth = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth()
  );

  const selectedThisYear =
    parseInt(selectedYear, 10) === currentDate.getFullYear();

  const previousYearTotal = selectedThisYear
    ? getTotalForDate(totalsPerYear, lastYearCurrentMonth)
    : getPreviousYearTotal(totalsPerYear, selectedYear);

  const change = calculatePercentageDiff(totalAmount, previousYearTotal);
  const changePercentage = getPercentageChangeText(
    change,
    selectedThisYear,
    selectedYear,
    lastYearCurrentMonth
  );

  const differenceText = (
    partialTot: number,
    ownerBalancesLenght: number,
    amount: number
  ) => {
    const diff = Math.floor(partialTot / ownerBalancesLenght - amount);

    if (diff === 0) return '';
    if (diff === Number.POSITIVE_INFINITY || diff === Number.NEGATIVE_INFINITY)
      return '';
    return `(-${formatCurrency(partialTot / ownerBalancesLenght - amount)})`;
  };

  const ownerBalances: OwnerBalance[] = [];

  table
    .getFilteredRowModel()
    .rows.map((r) => ({
      amount: parseFloat(r.getValue('amount')),
      owner: r.getValue('owner'),
    }))
    .forEach((item) => {
      const existingOwnerBalance = ownerBalances.find(
        (balance) => balance.owner === item.owner
      );
      if (existingOwnerBalance) {
        existingOwnerBalance.amount += item.amount;
      } else {
        ownerBalances.push({
          owner: item.owner as string,
          amount: item.amount,
          difference: differenceText(
            partialTotal,
            ownerBalances.length,
            item.amount
          ),
        });
      }
    });

  return (
    totalAmount > 0 && (
      <Tabs defaultValue="overview" className="space-y-4 animate-fade">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft>
            <div className="flex gap-2 flex-col sm:flex-row sm:gap-4 grow">
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard
                  title="Total"
                  contentText={formatCurrency(totalAmount)}
                  contentSubText={changePercentage}
                />
              </div>
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard
                  title="Partial Total"
                  contentText={formatCurrency(partialTotal)}
                >
                  {ownerBalances.map((balance: OwnerBalance) => (
                    <div
                      className="text-sm text-left"
                      key={`${balance.amount}-accordion`}
                    >
                      <div className="flex" key={`${balance.amount}-wrapper`}>
                        <div
                          className="mr-2 min-w-[60px] text-muted-foreground font-bold"
                          key={`${balance.amount}-owner`}
                        >
                          {balance.owner}:
                        </div>
                        <div
                          className="flex text-muted-foreground"
                          key={`${balance.amount}-amount`}
                        >
                          {formatCurrency(balance.amount)}
                          {balance.difference && (
                            <span
                              className="ml-2 text-slate-600 hidden xs:flex"
                              key={`${balance.amount}-difference`}
                            >
                              {balance.difference}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </SummaryCard>
              </div>
            </div>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}

export default Summary;
