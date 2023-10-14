import { Dashboard } from "@/app/dashboard/components/dashboard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {payments} from "@/lib/data";

export default async function DashboardPage() {
  return (
    <div className="container mx-auto px-6">
      <Card className="bg-transparent border-none">
        <CardHeader className="bg-transparent">
          <CardTitle
            title={"Overview"}
            className="flex flex-col items-center w-full justify-center bg-transparent"
          >
            <p className="m-6 text-2xl bg-transparent">Dashboard</p>
          </CardTitle>
        </CardHeader>
      </Card>
      <Dashboard data={payments}></Dashboard>
    </div>
  );
}
