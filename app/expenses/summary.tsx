import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table} from "@tanstack/react-table";
import {formatCurrency} from "@/app/utils/stringFormatter";
import {Tabs, TabsContent } from "@/components/ui/tabs";


export function SummaryCard({title, contentText, contentSubText}: {  title: string, contentText: string, contentSubText?: string }) {

    return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{contentText}</div>
                    <p className="text-xs text-muted-foreground">
                        {contentSubText}
                    </p>
                </CardContent>
            </Card>
    )
}

export function Summary<TData>({table}: {  table: Table<TData>  }) {
    const totalAmounts: number[] = table.getPreFilteredRowModel().rows.map((r) => parseFloat(r.getValue("amount")) );
    const total: number = totalAmounts.reduce((total, currentAmount) => total + currentAmount, 0);

    const formattedTotal = formatCurrency(total)

    const partialTotalAmounts: number[] = table.getFilteredRowModel().rows.map((r) => parseFloat(r.getValue("amount")) );
    const partialTotal: number = partialTotalAmounts.reduce((total, currentAmount) => total + currentAmount, 0);

    const formattedPartialTotal = formatCurrency(partialTotal)


    return (

        <Tabs defaultValue="overview" className="space-y-4">

            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <SummaryCard title={"Total"} contentText={formattedTotal} contentSubText={"+180.1% from last year"} />
                    <SummaryCard title={"Partial Total"} contentText={formattedPartialTotal} />
                </div>
            </TabsContent>
        </Tabs>
    )
}