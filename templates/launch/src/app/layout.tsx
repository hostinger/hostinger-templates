import type { Metadata } from "next";
import { Anton } from "next/font/google";
import type { ReactNode } from "react";
import { siteContent } from "@/content/site";
import "@/styles/foundation.css";
import "@/styles/sections.css";
import "@/styles/responsive.css";

// Self-hosted at build time so the display face renders identically on every
// OS. Impact (the previous system font) is not installed on Linux.
const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: siteContent.meta.title,
  description: siteContent.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
