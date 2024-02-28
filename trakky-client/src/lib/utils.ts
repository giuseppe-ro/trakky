function exportName(name: string, format: string) {
  return `${name} Export ${new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}.${format}`;
}

export function downloadFile(texts: string, format: string, name: string) {
  const file = new Blob([texts], { type: `text/${format}` });
  const element = document.createElement('a');
  element.href = URL.createObjectURL(file);
  element.download = exportName(name, format);
  document.body.appendChild(element);
  element.click();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function delay(promise: any, timeout = 5000) {
  await new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
  return promise;
}
