import { isToday, isTomorrow, isSameWeek, addWeeks, isBefore, startOfDay, parseISO } from "date-fns";

export type DeadlineKey = "noDeadline" | "overdue" | "today" | "tomorrow" | "thisWeek" | "nextWeek" | "later";

export const getDeadlineStatusFromIso = (isoString: string | null): DeadlineKey => {
  if (!isoString) return "noDeadline";

  const target = parseISO(isoString);
  const now = new Date();

  if (isBefore(startOfDay(target), startOfDay(now))) return "overdue";
  if (isToday(target)) return "today";
  if (isTomorrow(target)) return "tomorrow";

  const weekOpts = { weekStartsOn: 1 as const };

  if (isSameWeek(target, now, weekOpts)) return "thisWeek";
  if (isSameWeek(target, addWeeks(now, 1), weekOpts)) return "nextWeek";

  return "later";
};
