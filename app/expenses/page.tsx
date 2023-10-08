import { columns } from "./columns"
import { DataTable } from "./data-table"
import { makeData } from "./makeData"


export default async function DemoPage() {
  const data = makeData(500)

  return (
    <div className="container mx-auto p-6">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
