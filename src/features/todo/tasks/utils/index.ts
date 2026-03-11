export const mapDueDateToISO = (dateKey: string): string | null => {
  const date = new Date();

  switch (dateKey) {
    case "today":
      break;
    case "tomorrow":
      date.setDate(date.getDate() + 1);
      break;
    case "thisWeek": {
      const daysUntilSunday = 7 - date.getDay();
      date.setDate(date.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
      break;
    }
    case "nextWeek":
      date.setDate(date.getDate() + 7);
      break;
    case "noDate":
    default:
      return null;
  }

  return date.toISOString();
};
