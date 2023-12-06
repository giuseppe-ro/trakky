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

export function isValidDate(dateString: string) {
  return !isNaN(Date.parse(dateString));
}

export function convertDateFormat(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  return `${year}-${month}`;
}