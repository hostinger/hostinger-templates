import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.showName} — ${site.tagline}`,
    template: `%s · ${site.showName}`,
  },
  description: `${site.showName}: ${site.tagline} Every episode with a chaptered player and a searchable transcript.`,
};

export const viewport: Viewport = {
  themeColor: "#0b0912",
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
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
