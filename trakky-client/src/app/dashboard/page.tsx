import { Dashboard } from "@/app/dashboard/components/dashboard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { useEffect, useState } from "react";
import { fetchPayments, Payment } from "@/infrastructure/payment.tsx";

export default function DashboardPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetchPayments().then((data) => {
      setPayments(data);
    });
  }, []);

  return (
    <PageContainer>
      <Card className="bg-transparent border-none">
        <CardHeader className="bg-transparent">
          <CardTitle
            title={"Overview"}
            className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6"
          >
            <p className="m-6 text-2xl bg-transparent">Dashboard</p>
          </CardTitle>
        </CardHeader>
      </Card>
      <Dashboard data={payments}></Dashboard>
    </PageContainer>
  );
}
