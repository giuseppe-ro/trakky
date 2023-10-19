export function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "short",
  });
}

export function formatStringDate(date: string): string {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "short",
  });
}
