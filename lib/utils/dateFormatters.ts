export const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

export const formatDateToMMDDYY = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

/** Returns the month of a given date as 3 letters string: Jan, Feb, Mar, ...   */
export const getMonthShort = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", { month: "short" });
};

/** Returns YYYY-MM-DD for reliable date comparison (timezone-safe for "same calendar day"). */
export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** True if both dates are in the same calendar month. */
export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
