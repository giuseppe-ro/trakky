import { DataTable } from "./components/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {payments} from "@/lib/data";

export default async function Home() {
  return (
    <div className="container">
      <Card className="bg-transparent border-none">
        <CardHeader className="bg-transparent">
          <CardTitle className="flex flex-col items-center w-full justify-center bg-transparent">
            <p className="m-6 text-2xl bg-transparent">Expenses</p>
          </CardTitle>
        </CardHeader>
      </Card>
      <DataTable data={payments} />
    </div>
  );
}
