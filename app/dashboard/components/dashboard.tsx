"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Overview} from "@/app/dashboard/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import {
  getAvailableYears,
  getMonthlySummaries,
  getYearlySummaries,
} from "@/lib/utils";
import {budgets} from "@/lib/data";
import { Payment } from "@/infrastructure/payment";
import Loading from "@/app/loading";

export function Dashboard({ data }: { data: Payment[] })  {
  const availableYears = getAvailableYears(data);
  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  useEffect(() => {
    if (selectedYear === "All") setFilteredData(data);
    else {
      setFilteredData(
        data.filter(
          (payment) => payment.date.getFullYear() === parseInt(selectedYear),
        ),
      );
    }
  }, [selectedYear]);

  const monthlySummaries = getMonthlySummaries(filteredData, budgets);
  const summaries = getYearlySummaries(data, budgets);

  return (
      filteredData.length === 0 ?
          <Loading />
          : (
              <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle
                    title={"Overview"}
                    className="flex flex-col items-center w-full justify-center"
                >
                  <Select
                      defaultValue={selectedYear.toString()}
                      onValueChange={(e) => setSelectedYear(e)}
                  >
                    <SelectTrigger className="w-full rounded-t-md ">
                      <SelectValue placeholder="" className="rounded-t-md " />
                    </SelectTrigger>
                    <SelectContent className="rounded-t-md ">
                      <SelectGroup>
                        {availableYears.map((year) => (
                            <SelectItem className="rounded-t-md " key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="m-6 text-2xl">{selectedYear} Overview</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={monthlySummaries} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col items-center w-full justify-center">
                  <p className="m-6 text-2xl">Full Overview</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={summaries} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
          )
  );
}
