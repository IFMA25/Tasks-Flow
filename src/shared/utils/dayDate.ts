import { addDays, formatISO } from "date-fns";

const toDateString = (d: Date): string => formatISO(d, { representation: "date" });

export const todayDate = () => toDateString(new Date());
export const tomorrowDate = () => toDateString(addDays(new Date(), 1));
export const weekDate = () => toDateString(addDays(new Date(), 7));
export const lastWeekDate = () => toDateString(addDays(new Date(), -7));
export const lastMonthDate = () => toDateString(addDays(new Date(), -30));
