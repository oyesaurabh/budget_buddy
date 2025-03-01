export function convertTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  // Get day with leading zero
  const day = String(date.getDate()).padStart(2, "0");

  // Get month abbreviation (first letter capitalized)
  const month = date.toLocaleString("en-US", { month: "short" });

  // Get year
  const year = date.getFullYear();

  // Get time in 12-hour format
  const time = date
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", ""); // Remove space before AM/PM

  return `${day} ${month}, ${year} ${time}`;
}

export const formatCurrency = (
  amount: any,
  locale = "en-IN",
  currency = "INR"
) => {
  if (amount === undefined || amount === null) {
    return "₹0.00";
  }
  return Number(amount).toLocaleString(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
