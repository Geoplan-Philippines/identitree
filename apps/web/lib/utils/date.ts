import { format, subDays } from "date-fns";

/**
 * Parses a yyyy-MM-dd string into a local Date object at midnight.
 * Prevents timezone shifts often caused by parseISO or new Date(string).
 */
export const parseSafeDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return undefined;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  return new Date(y, m - 1, d);
};

/**
 * Returns a date range (from/to strings) that is inclusive of the current day.
 * @param days The total number of days to include in the range.
 */
export const getInclusiveDateRange = (days: number) => {
  const to = new Date();
  const from = subDays(to, days - 1);
  
  return {
    from: format(from, "yyyy-MM-dd"),
    to: format(to, "yyyy-MM-dd"),
  };
};
