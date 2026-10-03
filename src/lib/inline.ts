// Turns plain text with **bold** into safe HTML. Everything else is escaped.
export function inline(text: string): string {
  const escaped = text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
  return escaped.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}
