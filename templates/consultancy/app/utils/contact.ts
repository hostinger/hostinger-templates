export const getBookingHref = (bookingUrl: string, email: string) => {
  const configuredUrl = bookingUrl.trim()

  if (configuredUrl) {
    return configuredUrl
  }

  const subject = encodeURIComponent('Introductory call')
  const body = encodeURIComponent(
    'Hi Mara,\n\nI would like to book an introductory call. The knot I am working through is:\n\n',
  )

  return `mailto:${email}?subject=${subject}&body=${body}`
}
