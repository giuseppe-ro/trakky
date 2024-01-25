import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function exportName(name: string, format: string) {
  return `${name} Export ` + new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + `.${format}`;
}


export function downloadFile(texts: string, format: string, name: string) {
  const file = new Blob([texts], { type: `text/${format}` });
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = exportName(name, format);
  document.body.appendChild(element);
  element.click();
}