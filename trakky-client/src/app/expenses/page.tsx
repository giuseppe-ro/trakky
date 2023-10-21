import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { DataTable } from "./components/table";
import { fetchPayments, Payment } from "@/infrastructure/payment.tsx";
import { useEffect, useState } from "react";

export default function ExpensesPage() {
  const [payments, setPayments] = useState<Payment[] | null>(null);

  async function refreshData() {
    setPayments([]);
    const data = await fetchPayments();
    setPayments(data);
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContainer>
      <Card className="bg-transparent border-none">
        <CardHeader className="bg-transparent">
          <CardTitle className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6">
            <p className="m-6 text-2xl bg-transparent">Expenses</p>
          </CardTitle>
        </CardHeader>
      </Card>
      <DataTable data={payments} refreshData={refreshData} />
    </PageContainer>
  );
}
