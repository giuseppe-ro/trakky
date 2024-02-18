'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { FadeLeft } from '@/components/ui/animations/fade';
import React from 'react';
import {
  differenceText,
  formatCurrency,
  getPercentageChangeText,
} from '@/lib/formatter';
import { Total } from '@/models/total';
import AnimatedNumber from 'animated-number-react';
import { OwnerBalance } from '@/models/owner-balance';
import {
  getTotalForDate,
  getPreviousYearTotal,
  calculatePercentageDiff,
} from './calculators';

interface SummaryCardProps {
  title: string;
  amount?: number;
  contentSubText?: string;
  children?: React.ReactNode;
}

function AnimateNumber({
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
    <Card className="border rounded-xl p-1 md:p-4 h-[130px] md:h-[150px]">
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
  ownerBalances,
  totalAmount,
  partialTotal,
  totalsPerYear,
  selectedYear,
}: {
  ownerBalances: OwnerBalance[];
  totalAmount: number;
  partialTotal: number;
  totalsPerYear: Total[];
  selectedYear: string;
}) {
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

  return (
    totalAmount > 0 && (
      <Tabs defaultValue="overview" className="space-y-4 animate-fade">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft>
            <div className="flex gap-2 flex-col sm:flex-row sm:gap-4 grow">
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard
                  title="Total"
                  amount={totalAmount}
                  contentSubText={changePercentage}
                />
              </div>
              <div className="w-[100%] sm:w-[50%]">
                <SummaryCard title="Partial Total" amount={partialTotal}>
                  {ownerBalances.map((balance: OwnerBalance) => {
                    const difference = differenceText(
                      partialTotal,
                      ownerBalances.length,
                      balance.amount
                    );
                    return (
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
                            <AnimateNumber
                              amount={balance.amount}
                              formatter={formatCurrency}
                            />
                            <span
                              className="ml-2 text-slate-600 hidden xs:flex"
                              key={`${balance.amount}-difference`}
                            >
                              {difference > 0 && (
                                <AnimateNumber
                                  amount={-difference}
                                  formatter={formatCurrency}
                                />
                              )}
                            </span>
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

export default Summary;
