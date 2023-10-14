"use client";

import { DataTable } from "@/app/expenses/components/table";
import { Dashboard } from "@/app/dashboard/components/dashboard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { payments } from "@/lib/data";
import React, { useState } from "react";
import { getAvailableYears } from "@/lib/utils";
import { Selection } from "@/components/ui/select";
import { PageContainer } from "@/components/ui/page-container";
import { Separator } from "@/components/ui/separator";

export default function Home() {
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
          <div className="sticky top-0">
            <Selection
              value={selectedYear}
              onChange={setSelectedYear}
              options={availableYears}
              {...{
                className: "rounded-md w-full overscroll-contain sticky top-0",
              }}
            />
          </div>
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
