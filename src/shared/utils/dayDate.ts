import { addDays, formatISO } from "date-fns";

const today = new Date();
const toDateString = (d: Date): string => formatISO(d, { representation: "date" });

export const todayDate = toDateString(today);
export const tomorrowDate = toDateString(addDays(today, 1));
export const weekDate = toDateString(addDays(today, 7));
export const lastWeekDate = toDateString(addDays(today, -7));
export const lastMonthDate = toDateString(addDays(today, -30));
