const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[96m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
};

export function formatText(text) {
  // Replace color tags with ANSI escape codes, supporting multi-line tags
  let formattedText = text;
  Object.entries(COLORS).forEach(([color, code]) => {
    // Modified regex to support multi-line matching
    const regex = new RegExp(`\\[${color}\\](.*?)\\/\\]`, 'gs');
    formattedText = formattedText.replace(regex, (match, content) => {
      return `${code}${content.trim()}${COLORS.reset}`;
    });
  });
  
  // Add word wrapping
  const lines = formattedText.split('\n');
  const wrappedLines = lines.map(line => wordWrap(line, 80));
  return wrappedLines.join('\n');
}

function wordWrap(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}