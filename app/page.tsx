"use client"

import { DataTable } from "@/app/expenses/components/table";
import {Dashboard} from "@/app/dashboard/components/dashboard";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

import {payments} from "@/lib/data";

export default function Home() {
  return (
      <div className="container mx-auto px-6">
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
              <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                      <DataTable data={payments}/>
                      <Dashboard data={payments} />
                  </div>
              </TabsContent>
          </Tabs>
      </div>
  );
}
