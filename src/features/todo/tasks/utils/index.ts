const dueDateOffset: Record<string, number | null> = {
  today: 0,
  tomorrow: 1,
  thisWeek: null,
  nextWeek: 7,
  noDate: null,
};

export const mapDueDateToISO = (dateKey: string): string | null => {
  if (!(dateKey in dueDateOffset)) return null;

  const date = new Date();

  if (dateKey === "noDate") return null;

  if (dateKey === "thisWeek") {
    const daysUntilSunday = 7 - date.getDay();
    date.setDate(date.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
    return date.toISOString();
  }

  date.setDate(date.getDate() + (dueDateOffset[dateKey] ?? 0));
  return date.toISOString();
};

const dueDateLabels: { key: string; maxDays: number | null; label: string }[] = [
  { key: "overdue", maxDays: -1, label: "Overdue" },
  { key: "today", maxDays: 0, label: "Today" },
  { key: "tomorrow", maxDays: 1, label: "Tomorrow" },
  { key: "thisWeek", maxDays: 7, label: "This week" },
  { key: "nextWeek", maxDays: 14, label: "Next week" },
];

export const formatDueDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "No due date";

  const now = new Date();
  const target = new Date(isoDate);
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";

  const match = dueDateLabels.find(({ maxDays }) => maxDays !== null && diffDays <= maxDays);
  return match?.label;
};

