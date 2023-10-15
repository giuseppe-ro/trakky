import './App.css'
import {getAvailableYears} from "@/lib/summaries.ts";
import {payments} from "@/lib/data.ts";
import {useState} from "react";
import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {PageContainer} from "@/components/ui/page-container.tsx";
import {Tabs, TabsContent} from "@/components/ui/tabs.tsx";
import {DataTable} from "@/app/expenses/components/table.tsx";
import {Dashboard} from "@/app/dashboard/components/dashboard.tsx";
import {Selection} from "@/components/ui/select.tsx";


function App() {
  const availableYears = getAvailableYears(payments);
  availableYears.push("All");

  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  return (
      <PageContainer>
        <Card className="bg-transparent border-none">
          <CardHeader className="bg-transparent">
            <CardTitle
                title={"Overview"}
                className="flex flex-col items-center w-full justify-center bg-transparent"
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
                    className: "rounded-md w-full overscroll-contain",
                  }}
              />
          )}
          <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
            <div className="lg:grid gap-4 lg:grid-cols-7">
              <DataTable
                  data={payments}
                  selection={selectedYear}
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

export default App
