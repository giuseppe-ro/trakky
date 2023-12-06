export function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleString('en-GB', {month: 'short', year: 'numeric'});
}

export function formatStringDate(date: string): string {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "short",
  });
}

export function isValidDate(date: string) {
  return !isNaN(Date.parse(date));
}

export function convertDateFormat(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  return `${year}-${month}`;
}