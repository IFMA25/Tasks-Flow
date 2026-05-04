import { addDays, formatISO } from "date-fns";

const toDateString = (d: Date): string => formatISO(d, { representation: "date" });

export const getTodayDate = (): string => toDateString(new Date());
export const getTomorrowDate = (): string => toDateString(addDays(new Date(), 1));
export const getWeekDate = (): string => toDateString(addDays(new Date(), 7));
export const getLastWeekDate = (): string => toDateString(addDays(new Date(), -7));
export const getLastMonthDate = (): string => toDateString(addDays(new Date(), -30));
