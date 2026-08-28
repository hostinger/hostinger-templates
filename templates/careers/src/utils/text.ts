/**
 * Fills `{placeholder}` tokens in a copy template from site.json,
 * e.g. fillTemplate("Showing {shown} of {total}", { shown: 2, total: 4 }).
 * Unknown placeholders are left untouched.
 */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  );
}
