"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "./footer";

export default function WeirdWebOctober() {
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");

  const getRandomColor = (saturation: number, lightness: number) => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    setBgColor(getRandomColor(70, 80));
    setTextColor(getRandomColor(70, 30));
  }, []);


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-2">
          Weird Web October
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-center opacity-80 mb-6">
          v0 Edition
        </h2>

        <p className="text-center mb-6 text-lg">
          <a
            href="https://weirdweboctober.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            Tinkering with weirdness
          </a>{" "}
          in the small pockets of time found anywhere in these long October
          nights. Accompanied by{" "}
          <a
            href="https://v0.dev/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            v0
          </a>
          , empowered by own weirdness.
        </p>

        <ul className="text-left list-disc pl-5">
          <li className="text-lg font-medium">
            <Link href="/hashtags" passHref>
              <span
                className="px-3 py-1 rounded-full inline-block hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${textColor}20` }}
              >
                Hashtags [08/10/2024]
              </span>
            </Link>
           
          </li>
          <li className="text-lg font-medium"> <Link href="/blessed" passHref>
              <span
                className="px-3 py-1 rounded-full inline-block hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${textColor}20` }}
              >
                Blessed [09/10/2024]
              </span>
            </Link>
            </li>
            <li className="text-lg font-medium"> <Link href="/art" passHref>
              <span
                className="px-3 py-1 rounded-full inline-block hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${textColor}20` }}
              >
                Art [10/10/2024]
              </span>
            </Link>
            </li>
        </ul>
      </div>

      <Footer />
    </div>
  );
}
