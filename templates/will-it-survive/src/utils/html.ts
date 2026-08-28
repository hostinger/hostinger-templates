export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

export function renderInto(id: string, html: string): HTMLElement {
  const target = document.getElementById(id);
  if (!target) {
    throw new Error(`Missing mount point: #${id}`);
  }
  target.innerHTML = html;
  return target;
}
