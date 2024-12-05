export function formatTimestamp(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${hours}:${minutes}:${seconds}`;
}