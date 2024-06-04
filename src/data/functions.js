export function truncateString(value, maxLength = 30) {
  if (value.length > maxLength) {
    return value.substring(0, maxLength) + "...";
  }
  return value;
}
