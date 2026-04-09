export const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || "en";

export const supportedLocales = (import.meta.env.VITE_SUPPORTED_LOCALE || "en,uk")
  .split(",")
  .map((l: string) => l.trim().toLowerCase());
