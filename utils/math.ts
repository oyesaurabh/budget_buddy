export function convertTimestamp(timestamp: string): string {
  // Parse the timestamp
  const date = new Date(timestamp);

  // Extract the required date components
  const day = String(date.getDate()).padStart(2, "0"); // Day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month (0-indexed)
  const year = String(date.getFullYear()).slice(-4); // Last two digits of the year
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes

  // Determine AM/PM and convert hours to 12-hour format
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = String(hours % 12 || 12); // Convert to 12-hour format

  // Format the final output
  return `${day}-${month}-${year}, ${formattedHours}:${minutes} ${ampm}`;
}
