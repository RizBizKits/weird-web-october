"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Hashtags() {
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [isSad, setIsSad] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const jumpIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomColor = (saturation: number, lightness: number) => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    setBgColor(getRandomColor(70, 80));
    setTextColor(getRandomColor(70, 30));
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const svgCenterX = svgRect.left + svgRect.width / 2;
        const svgCenterY = svgRect.top + svgRect.height / 2;
        const angle = Math.atan2(
          event.clientY - svgCenterY,
          event.clientX - svgCenterX
        );
        const distance = Math.min(
          5,
          Math.sqrt(
            Math.pow(event.clientX - svgCenterX, 2) +
              Math.pow(event.clientY - svgCenterY, 2)
          ) / 10
        );
        setEyePosition({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }

      setIsJumping(false);
      setIsSad(false);
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
      if (jumpIntervalRef.current) {
        clearInterval(jumpIntervalRef.current);
      }

      cursorTimeoutRef.current = setTimeout(() => {
        setIsJumping(true);
        setJumpCount(0);
        jumpIntervalRef.current = setInterval(() => {
          setJumpCount((prevCount) => {
            if (prevCount === 3) {
              setIsSad(true);
              if (jumpIntervalRef.current) {
                clearInterval(jumpIntervalRef.current);
              }
            }
            return prevCount + 1;
          });
        }, 500);
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
      if (jumpIntervalRef.current) {
        clearInterval(jumpIntervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          Hashtags
        </h1>

        <div className="bg-white p-4 shadow-lg transform rotate-2 mb-8">
          <div
            className="aspect-square w-full mb-4 flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <svg
              viewBox="0 0 100 100"
              className={`w-3/4 h-3/4 ${isJumping ? "animate-bounce" : ""}`}
              ref={svgRef}
            >
              <g style={{ fill: textColor }}>
                <rect x="20" y="10" width="10" height="80" rx="5" />
                <rect x="70" y="10" width="10" height="80" rx="5" />
                <rect x="10" y="30" width="80" height="10" rx="5" />
                <rect x="10" y="60" width="80" height="10" rx="5" />

                <circle cx="35" cy="40" r="7" fill="white" />
                <circle
                  cx={35 + eyePosition.x}
                  cy={40 + eyePosition.y}
                  r="3.5"
                />

                <circle cx="65" cy="40" r="7" fill="white" />
                <circle
                  cx={65 + eyePosition.x}
                  cy={40 + eyePosition.y}
                  r="3.5"
                />

                <path
                  d={isSad ? "M 35 70 Q 50 60 65 70" : "M 35 65 Q 50 80 65 65"}
                  fill="none"
                  stroke="black"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
          <p className="text-center text-black font-handwriting text-lg uppercase">
            AN ICON, NAY A SYMBOL
          </p>
        </div>

        <div className="text-center">
          <Link href="/" passHref>
            <span
              className="px-4 py-2 rounded-full inline-block hover:opacity-80 transition-opacity text-lg font-medium"
              style={{ backgroundColor: `${textColor}20` }}
            >
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
