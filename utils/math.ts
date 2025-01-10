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
