import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import IntroSplash from "@/components/IntroSplash";
import CookieConsent from "@/components/CookieConsent";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DYNA Digital Group",
  description: "Custom software, digital products and AI & automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={instrument.variable} data-intro="1" suppressHydrationWarning>
      <body>
        <IntroSplash />
        <Navbar />
        <Cursor />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
