export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
