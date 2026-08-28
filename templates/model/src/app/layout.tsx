import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteContent } from "@/content/site";
import "@/styles/foundation.css";
import "@/styles/sections.css";
import "@/styles/responsive.css";

export const metadata: Metadata = {
  title: siteContent.meta.title,
  description: siteContent.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
