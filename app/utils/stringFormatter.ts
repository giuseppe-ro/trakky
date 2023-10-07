
export function formatCurrency(total: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(total)
}