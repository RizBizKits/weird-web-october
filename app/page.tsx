import { Metadata } from "next";
import WeirdWebOctober from "./home";
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
export default function Home() {
  return <WeirdWebOctober />;
}
