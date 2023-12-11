import { formatCurrency } from "@/lib/formatter.ts";

export function AmountSummary(
  { label, amount, difference, color }: { label: string, amount: number, difference?: number, color?: string }) {

  console.log(`bg-[${color ?? ""}] mr-2`)
  return (
    <div className="text-sm text-left z-40">
      <div className="flex">
        <div className={`mr-2 min-w-[80px]`} style={{ color: color}}>{label}:</div>
        <div className="flex text-muted-foreground">${formatCurrency(amount)}
          {difference && <div className={`ml-2 ${difference >= 0 ? "text-slate-600" : "text-red-900"}`}>({formatCurrency(difference)})</div>}
        </div>
      </div>
    </div>
  );
}
