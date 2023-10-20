import "./App.css";
import { getAvailableYears } from "@/lib/summaries.ts";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { PageContainer } from "@/components/ui/page-container.tsx";
import { Tabs, TabsContent } from "@/components/ui/tabs.tsx";
import { DataTable } from "@/app/expenses/components/table.tsx";
import { Dashboard } from "@/app/dashboard/components/dashboard.tsx";
import { Selection } from "@/components/ui/select.tsx";
import { fetchPayments, Payment } from "@/infrastructure/payment.tsx";

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  async function refreshData() {
    setPayments([]);
    const data = await fetchPayments();
    setPayments(data);
    const years = getAvailableYears(data);
    years.push("All");
    setAvailableYears(years);
  }

  useEffect(() => {
    refreshData();
  }, []);

  const [selectedYear, setSelectedYear] = useState("All");

  return (
    <PageContainer>
      <Card className="bg-transparent border-none">
        <CardHeader className="bg-transparent">
          <CardTitle
            title={"Overview"}
            className="flex flex-col items-center w-full justify-center bg-transparent p-0 md:p-6"
          >
            <p className="m-6 text-2xl bg-transparent">Overview</p>
          </CardTitle>
        </CardHeader>
      </Card>
      <Tabs defaultValue="overview" className="space-y-4">
        {availableYears.length > 0 && (
          <Selection
            value={selectedYear}
            onChange={setSelectedYear}
            options={availableYears}
            {...{
              className:
                "rounded-md w-full overscroll-contain sticky top-20 bg-gray-950 z-50",
            }}
          />
        )}
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <div className="lg:grid gap-4 lg:grid-cols-7">
            <DataTable
              data={payments}
              selection={selectedYear}
              refreshData={refreshData}
              {...{ className: "lg:col-span-3" }}
            />
            <Dashboard
              data={payments}
              selection={selectedYear}
              {...{ className: "lg:col-span-4 mt-6 lg:mt-0" }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default App;
