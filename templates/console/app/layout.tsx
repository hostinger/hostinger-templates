import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import { site } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.product} ${site.console} — ${site.tagline}`,
    template: `%s · ${site.product} ${site.console}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
