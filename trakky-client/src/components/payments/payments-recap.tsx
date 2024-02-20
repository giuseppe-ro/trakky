import { Payment } from '@/models/dtos';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatter';

function PaymentsRecap({
  entries,
  limitedSpace,
}: {
  entries: Payment[];
  limitedSpace?: boolean;
}) {
  const tdStyle = 'px-2 text-left border overflow-x-scroll scroll-smooth';
  return (
    <table className="flex justify-center align-middle">
      <tbody className={limitedSpace ? 'overflow-scroll max-h-[130px]' : ''}>
        {entries.map((payment: Payment) => {
          const textColor =
            payment.amount < 0 ? 'text-red-300' : 'text-green-300';

          return (
            <TableRow
              key={`${payment.id}-recap-row`}
              className={`flex max-w-[460px]  ${textColor}`}
            >
              <td className={cn(`${tdStyle} w-[75px] text-left`)}>
                {new Date(payment.date).toLocaleString('en-GB', {
                  month: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className={cn(`${tdStyle} w-[80px]`)}>{payment.type}</td>
              {!limitedSpace && (
                <td className={cn(`${tdStyle} w-[55px]`)}>{payment.owner}</td>
              )}
              <td
                className={cn(`${tdStyle} text-right w-[80px] overflow-auto`)}
              >
                {formatCurrency(payment.amount)}
              </td>
              <td className={cn(`${tdStyle} w-[110px] overflow-auto`)}>
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
