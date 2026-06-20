import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Display: a high-contrast, characterful serif (the editorial voice).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

// Body: a warm, slightly humanist grotesque.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Mono: kept for financial data, tickers, and labels.
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Valyra — Home equity, unlocked",
  description:
    "Valyra lets Dutch homeowners unlock cash from their home's future appreciation — no debt, no interest — and lets retail investors buy fractional, tokenized shares from €100.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${hanken.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
