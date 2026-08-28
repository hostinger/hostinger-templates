/** Replaces `{key}` placeholders in a copy template with the given values. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}
