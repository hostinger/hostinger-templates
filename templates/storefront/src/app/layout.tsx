import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Kado Objects — Tools for considered work",
    template: "%s — Kado Objects",
  },
  description:
    "Small-run desk objects designed in Kyoto: task lights, trays, organisers and writing tools.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
