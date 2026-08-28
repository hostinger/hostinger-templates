import type { ReactNode } from "react";
import type { LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./styles/global.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = "Something broke";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : `Error ${error.status}`;
    details =
      error.status === 404
        ? "This page doesn't exist. Every open role lives on the board."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main className="error-shell">
      <h1>{message}</h1>
      <p>{details}</p>
      <Link to="/">Back to the board</Link>
    </main>
  );
}
