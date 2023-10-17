import { Dashboard } from "@/app/dashboard/components/dashboard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import { payments } from "@/lib/data";

export default function DashboardPage() {
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
