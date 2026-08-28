import type { FC, PropsWithChildren } from 'hono/jsx';

/** Document shell: head metadata, styles, optional JSON-LD and the enhancement script. */
export const Layout: FC<
  PropsWithChildren<{ title: string; description: string; jsonLd?: string }>
> = ({
  title,
  description,
  jsonLd,
  children,
}) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="stylesheet" href="/styles/main.css" />
      {jsonLd === undefined ? null : (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}
      <script src="/js/enhance.js" defer></script>
    </head>
    <body>
      <a class="skip-link" href="#main">Skip to content</a>
      {children}
    </body>
  </html>
);
