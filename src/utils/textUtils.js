// Text centering and formatting utilities
export function centerText(text, width) {
  const textLength = stripAnsiCodes(text).length;
  const padding = Math.max(0, Math.floor((width - textLength) / 2));
  return ' '.repeat(padding) + text;
}

function stripAnsiCodes(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}