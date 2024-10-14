import { Payment } from '@/models/dtos';
import { TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/text-formatter';
import { twMerge } from 'tailwind-merge';

function PaymentsRecap({
  entries,
  limitedSpace,
}: {
  entries: Payment[];
  limitedSpace?: boolean;
}) {
  const tdStyle =
    'px-2 scroll-smooth overflow-x-scroll max-h-6 text-nowrap no-scrollbar';
  return (
    <table className="flex w-full">
      <tbody
        className={twMerge('w-full mx-4', limitedSpace && 'max-h-[130px]')}
      >
        {entries.map((payment: Payment) => {
          const date =
            payment.date === ''
              ? ''
              : new Date(payment.date).toLocaleString('en-GB', {
                  month: 'numeric',
                  year: 'numeric',
                });
          return (
            <TableRow
              key={`${payment.id}-${payment.owner}-recap-row`}
              className={twMerge(
                'flex justify-center align-middle',
                payment.amount < 0 ? 'text-red-300' : 'text-green-300'
              )}
            >
              {date !== '' && (
                <td className={twMerge('w-[75px] text-left', tdStyle)}>
                  {date}
                </td>
              )}
              <td className={twMerge('w-[80px]', tdStyle)}>{payment.type}</td>
              {!limitedSpace && (
                <td className={twMerge('w-[55px]', tdStyle)}>
                  {payment.owner}
                </td>
              )}
              <td className={twMerge('text-right w-[80px]', tdStyle)}>
                {formatCurrency(payment.amount)}
              </td>
              <td className={twMerge('w-[80px]', tdStyle)}>
                {payment.description}
              </td>
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
}

PaymentsRecap.defaultProps = {
  limitedSpace: false,
};
export default PaymentsRecap;
