import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Weird Web October - v0 Edition",
  description:
    "Tinkering with weirdness in the small pockets of time found anywhere in these long October nights.",
  openGraph: {
    title: "Weird Web October - v0 Edition",
    description:
      "Tinkering with weirdness in the small pockets of time found anywhere in these long October nights.",
    images: [
      {
        url: "https://weird-web-october.vercel.app/og",
        width: 1200,
        height: 630,
        alt: "Weird Web October - v0 Edition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weird Web October - v0 Edition",
    description:
      "Tinkering with weirdness in the small pockets of time found anywhere in these long October nights.",
    images: ["https://weird-web-october.vercel.app/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
