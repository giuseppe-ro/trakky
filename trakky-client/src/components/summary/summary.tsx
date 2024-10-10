'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FadeLeft } from '@/components/ui/animations/fade';
import React from 'react';
import { formatCurrency, getPercentageChangeText } from '@/lib/text-formatter';
import { Total } from '@/models/total';
import AnimatedNumber from 'animated-number-react';
import {
  getTotalForDate,
  getPreviousYearTotal,
  calculatePercentageDiff,
} from './calculators';
import { Dictionary } from '../ui/table/icons';

interface SummaryCardProps {
  title: string;
  amount?: number;
  contentSubText?: string;
  children?: React.ReactNode;
}

export function AnimateNumber({
  amount,
  formatter,
}: {
  amount: number | null | undefined;
  formatter: (amount: number) => string;
}) {
  if (amount === null || amount === undefined) return null;

  return <AnimatedNumber value={amount} formatValue={formatter} />;
}

function SummaryCard({
  title,
  amount,
  contentSubText,
  children,
}: SummaryCardProps) {
  return (
    <Card className="border rounded-xl p-1 md:p-4 h-[130px] md:h-[150px] overflow-scroll">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:p-4">
        <div className="text-xl md:text-2xl font-bold">
          <AnimateNumber amount={amount} formatter={formatCurrency} />
        </div>
        <div className="text-xs text-muted-foreground">
          {contentSubText}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

SummaryCard.defaultProps = {
  amount: null,
  contentSubText: '',
  children: null,
};

export function Summary({
  balances,
  totalAmount,
  partialTotal,
  totalsPerYear,
  selectedYear,
  selectedMonth,
}: {
  balances: Dictionary<number> | undefined;
  totalAmount: number;
  partialTotal: number;
  totalsPerYear: Total[];
  selectedYear: string;
  selectedMonth?: string;
}) {
  const currentDate = new Date();
  const lastYearCurrentMonth = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth()
  );

  const selectedThisYear =
    parseInt(selectedYear, 10) === currentDate.getFullYear();

  const selectedMonthNumber =
    selectedMonth === '' || selectedMonth === 'All Months'
      ? 0
      : new Date(Date.parse(`${selectedMonth} 1, 2012`)).getMonth() + 1;

  const previousYearTotal = selectedThisYear
    ? getTotalForDate(totalsPerYear, lastYearCurrentMonth, selectedMonthNumber)
    : getPreviousYearTotal(totalsPerYear, selectedYear, selectedMonthNumber);

  const change = calculatePercentageDiff(totalAmount, previousYearTotal);
  const changePercentage = getPercentageChangeText(
    change,
    selectedThisYear,
    lastYearCurrentMonth,
    selectedMonth ?? 'All Months'
  );

  return (
    totalAmount > 0 && (
      <Tabs defaultValue="overview" className="space-y-4 animate-fade">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft>
            <div className="flex gap-2 flex-row sm:gap-4 grow">
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard
                  title="Total"
                  amount={totalAmount}
                  contentSubText={changePercentage}
                />
              </div>
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard title="Partial Total" amount={partialTotal}>
                  {balances &&
                    Object.keys(balances).map((user) => {
                      return (
                        <div
                          className="text-sm text-left"
                          key={`${user}-accordion`}
                        >
                          <div className="flex">
                            <div className="mr-2 w-[80px] overflow-x-scroll no-scrollbar text-muted-foreground">
                              {user}:
                            </div>
                            <div className="flex text-muted-foreground">
                              <AnimateNumber
                                amount={balances[user]}
                                formatter={formatCurrency}
                              />
                              <span className="ml-2 hidden xs:flex" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </SummaryCard>
              </div>
            </div>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}

Summary.defaultProps = {
  selectedMonth: 'All Months',
};

export default Summary;
