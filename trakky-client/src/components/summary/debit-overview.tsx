import { MoveRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { formatAmount } from '@/lib/text-formatter';
import { OwedBalance } from '@/models/debitor-balance';
import { AnimateNumber } from './summary';

interface DebitOverviewProps {
  debitorName: string;
  owed: OwedBalance;
  maxDigits: number;
  children?: JSX.Element;
}

export default function DebitOverview({
  debitorName,
  owed,
  maxDigits,
  children,
  ...props
}: DebitOverviewProps) {
  return (
    <div
      className="flex ml-1 border-t gap-2 align-middle justify-between overflow-y-hidden no-scrollbar"
      {...props}
    >
      <div className="min-w-[60px] overflow-x-scroll">
        <div className="text-base text-yellow-600 h-5 text-muted-foreground text-nowrap no-scrollbar">
          {debitorName}:
        </div>
      </div>
      <div className="flex text-yellow-600 gap-4 text-base text-muted-foreground font-thin">
        <div>Owes</div>
        <div>
          <MoveRight />
        </div>
        <div
          className={twMerge(
            `min-w-[${maxDigits * 6}px]`,
            'max-w-16 sm:max-w-24 md:max-w-full',
            'flex flex-row mx-1 font-medium justify-between overflow-x-scroll no-scrollbar'
          )}
        >
          <div>£</div>
          <div>
            <AnimateNumber amount={owed.amount} formatter={formatAmount} />
          </div>
        </div>
        <div>
          <MoveRight />
        </div>
        <div className="w-16 overflow-x-scroll"> {owed.to}</div>
      </div>
      {children}
    </div>
  );
}

DebitOverview.defaultProps = {
  children: null,
};
