export function formatCurrency(total: number) {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(total)
}

export function formatDate(date: Date): string  {
    const formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(date);
    const formattedDate = `${parts[4].value}-${parts[0].value}-${parts[2].value}`;
    return formattedDate
}