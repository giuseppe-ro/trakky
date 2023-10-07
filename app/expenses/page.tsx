import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { makeData } from "./makeData"

async function getData(): Promise<Payment[]> {
  const data = makeData(500)
  return data;
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-6">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
