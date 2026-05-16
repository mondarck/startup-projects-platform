import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString("ar-DZ");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getStatusLabel(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    pending: { label: "في الانتظار", color: "yellow" },
    active: { label: "نشط", color: "green" },
    suspended: { label: "معلق", color: "red" },
    available: { label: "متاح", color: "green" },
    reserved: { label: "محجوز", color: "blue" },
    archived: { label: "مؤرشف", color: "gray" },
    cancelled: { label: "ملغى", color: "red" },
    completed: { label: "مكتمل", color: "green" },
  };
  return statuses[status] ?? { label: status, color: "gray" };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
