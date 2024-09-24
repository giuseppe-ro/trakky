import { Payment } from '@/models/dtos';
import { TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatter';
import { twMerge } from 'tailwind-merge';

function PaymentsRecap({
  entries,
  limitedSpace,
}: {
  entries: Payment[];
  limitedSpace?: boolean;
}) {
  const tdStyle =
    'px-2 text-left border scroll-smooth overflow-scroll no-scrollbar';
  return (
    <table className="flex justify-center align-middle">
      <tbody className={limitedSpace ? 'max-h-[130px]' : ''}>
        {entries.map((payment: Payment) => (
          <TableRow
            key={`${payment.id}-recap-row`}
            className={twMerge(
              'flex max-w-[460px] ',
              payment.amount < 0 ? 'text-red-300' : 'text-green-300'
            )}
          >
            <td className={twMerge('w-[75px] text-left', tdStyle)}>
              {new Date(payment.date).toLocaleString('en-GB', {
                month: 'numeric',
                year: 'numeric',
              })}
            </td>
            <td className={twMerge('w-[80px]', tdStyle)}>{payment.type}</td>
            {!limitedSpace && (
              <td className={twMerge('w-[55px]', tdStyle)}>{payment.owner}</td>
            )}
            <td className={twMerge('text-right w-[80px]', tdStyle)}>
              {formatCurrency(payment.amount)}
            </td>
            <td className={twMerge('w-[110px]', tdStyle)}>
              {payment.description}
            </td>
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

PaymentsRecap.defaultProps = {
  limitedSpace: false,
};
export default PaymentsRecap;
