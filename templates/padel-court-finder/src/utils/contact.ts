export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

export const mailtoHref = (email: string, subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${email}${query ? `?${query}` : ''}`;
};
