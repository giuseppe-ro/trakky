import {
  PaymentOverview,
  OwnerOverview,
  ExpensesDashboard,
  UsersDashboard,
  ExpensesPieChart,
} from '@/components/dashboards/charts';
import { SubTitle } from '@/components/ui/text';

interface DashboardsProps {
  paymentOverviews: PaymentOverview[];
  ownersOverview: OwnerOverview[];
  expensesBreakdown:
    | {
        name: string;
        value: number;
      }[]
    | undefined;
}

function Dashboards({
  paymentOverviews,
  ownersOverview,
  expensesBreakdown,
}: DashboardsProps) {
  return (
    <>
      <div className="mt-6 text-center mr-4 lg:mx-0">
        <div className="lg:grid gap-4 lg:grid-cols-2">
          <div className="mt-4 sm:mt-0">
            <SubTitle title="Expenses" />
            <ExpensesDashboard data={paymentOverviews} />
          </div>
          <div className="mt-4 sm:mt-0">
            <SubTitle title="Users Comparison" {...{ className: 'mb-4' }} />
            <UsersDashboard data={ownersOverview} />
          </div>
        </div>
      </div>
      <div className="mt-6 text-center mr-4 lg:mx-0">
        <div className="lg:grid gap-4 lg:grid-cols-1">
          <div className="mt-6 lg:mt-0">
            <SubTitle title="Breakdown" />
            <ExpensesPieChart data={expensesBreakdown} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboards;
