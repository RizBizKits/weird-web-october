"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const text = `"I wish there was a way to know you were in the good old days before you actually left them"`;
const words = text.split(" ");

const images = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.49.02%E2%80%AFPM-qzWIeFFjSnQ1ti3cnqNmA4n2pJuPNk.png",
    alt: "VIP Patron merchandise",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.39.24%E2%80%AFPM-bHdDlX8M8IPEs3IKdoq50qRiTC5D1Q.png",
    alt: "Whaliant banner with cartoon whales",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.38.48%E2%80%AFPM-JIWHHugt3y9fkhKKNyipQG055brrfc.png",
    alt: "Best place in the pond",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.37.32%E2%80%AFPM-XTiavdmnDRJvL21apMofDJqGUM7xap.png",
    alt: "PF Team 2020",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.39.50%E2%80%AFPM-1ieCw0koNLkZO5rmKCJCGXgMriOFW2.png",
    alt: "Power in design quote",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.39.40%E2%80%AFPM-MDYtme0oCGEyz59JoafFM80LJuUHFT.png",
    alt: "Collaborative workspace",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-21%20at%2011.49.26%E2%80%AFPM-dpX6QXNFKSrGcAnoIm0It00zyh9IYS.png",
    alt: "standing together",
  },
];

const positions = [
  "top-0 left-0",
  "top-0 right-0",
  "bottom-0 left-0",
  "bottom-0 right-0",
  "top-0 left-0",
  "top-1/4 right-1/4 translate-x-[65%] -translate-y-[65%]",
  "bottom-1/4 left-1/4 -translate-x-[65%] translate-y-[65%]",
  "bottom-1/4 right-1/4 translate-x-[65%] translate-y-[65%]",
];

export default function AnimatedTextWithBackground() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        "Eagle Lake",
        "url(https://fonts.gstatic.com/s/eaglelake/v20/ptRMTiqc4ouSzDjafLJh5OPk.woff2)"
      );
      try {
        await font.load();
        document.fonts.add(font);
        setFontLoaded(true);
      } catch (err) {
        console.error("Failed to load Eagle Lake font:", err);
        setFontLoaded(true); // Proceed with fallback font
      }
    };
    loadFont();
  }, []);

  useEffect(() => {
    if (textAnimationComplete) {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < images.length) {
          setVisibleImages((prev) => [...prev, currentIndex]);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [textAnimationComplete]);

  return (
    <div className="relative h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {textAnimationComplete &&
        images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-48 h-48 transition-all duration-300 ease-in-out ${
              index === 4 ? "top-2 left-2" : positions[index]
            } ${
              visibleImages.includes(index) ? "opacity-100" : "opacity-0"
            } animate-float`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className={`rounded-lg transition-all duration-300 ${
                hoveredIndex === index || visibleImages.length < images.length
                  ? "filter-none"
                  : "filter blur-md grayscale"
              }`}
            />
          </div>
        ))}
      <div className="relative z-10 w-full max-w-5xl text-center">
        {fontLoaded && (
          <p className="text-[1.5rem] md:text-[2.25rem] lg:text-[3rem] text-white leading-relaxed font-['Eagle_Lake',cursive] mix-blend-difference">
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block whitespace-nowrap mr-[0.25em] opacity-0 animate-write"
                style={{
                  animationDelay: `${wordIndex * 0.15}s`,
                  animationFillMode: "forwards",
                }}
                onAnimationEnd={() => {
                  if (wordIndex === words.length - 1) {
                    setTextAnimationComplete(true);
                  }
                }}
              >
                {word}
              </span>
            ))}
          </p>
        )}
        <span className="sr-only">{text}</span>
      </div>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap");

        @keyframes write {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-write {
          animation: write 0.3s ease-out;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-11px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
