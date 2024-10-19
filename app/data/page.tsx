'use client'

import React, { useRef, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"

const GlitteringStars = () => (
  <>
    {Array.from({ length: 50 }).map((_, i) => (
      <circle
        key={i}
        cx={Math.random() * 800}
        cy={Math.random() * 400}
        r={Math.random() * 1.5}
        fill="#ffffff"
      >
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur={`${Math.random() * 3 + 1}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}
  </>
)

const LondonScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Sky */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    <GlitteringStars />

    {/* Sun */}
    <circle cx="700" cy="80" r="40" fill="#FFD700">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Big Ben */}
    <g transform="translate(350, 50)">
      {/* Tower base */}
      <rect x="0" y="150" width="100" height="200" fill="#a0a0a0" />

      {/* Clock face */}
      <circle cx="50" cy="170" r="40" fill="#ffffff" stroke="#808080" strokeWidth="5" />
      <line x1="50" y1="170" x2="50" y2="140" stroke="#808080" strokeWidth="3">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 170"
          to="360 50 170"
          dur="60s"
          repeatCount="indefinite"
        />
      </line>
      <line x1="50" y1="170" x2="70" y2="170" stroke="#808080" strokeWidth="3">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 170"
          to="360 50 170"
          dur="3600s"
          repeatCount="indefinite"
        />
      </line>

      {/* Tower top */}
      <polygon points="10,150 90,150 75,100 25,100" fill="#c0c0c0" />
      <polygon points="25,100 75,100 65,70 35,70" fill="#d0d0d0" />
      <rect x="45" y="30" width="10" height="40" fill="#e0e0e0" />
    </g>

    {/* Ground */}
    <rect x="0" y="350" width="800" height="70" fill="#b0b0b0" />

    {/* Trees */}
    {[100, 600].map((x, i) => (
      <g key={i}>
        <path d={`M${x} 400 L${x - 20} 350 L${x} 300 L${x + 20} 350 Z`} fill="#808080">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 2,-2; 0,0; -2,-2; 0,0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <rect x={x - 5} y={350} width="10" height="50" fill="#606060" />
      </g>
    ))}

    {/* London Buses */}
    <g>
      <rect x="-80" y="320" width="60" height="30" fill="#c00000" rx="5" ry="5">
        <animateMotion
          path="M-80 0 H880"
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="-80" y="335" width="60" height="15" fill="#800000" rx="5" ry="5">
        <animateMotion
          path="M-80 0 H880"
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g>
      <rect x="-80" y="320" width="60" height="30" fill="#c00000" rx="5" ry="5">
        <animateMotion
          path="M880 0 H-80"
          dur="15s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="-80" y="335" width="60" height="15" fill="#800000" rx="5" ry="5">
        <animateMotion
          path="M880 0 H-80"
          dur="15s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  </svg>
)

const SanFranciscoScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Sky */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    <GlitteringStars />

    {/* Sun */}
    <circle cx="700" cy="80" r="40" fill="#FFD700">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Hills */}
    <path d="M0 250 Q200 150 400 250 T800 250 V400 H0 Z" fill="#b0b0b0" />
    <path d="M0 300 Q200 200 400 300 T800 300 V400 H0 Z" fill="#c0c0c0" />

    {/* Golden Gate Bridge */}
    <g transform="translate(100, 100) scale(0.8)">
      {/* Bridge deck */}
      <rect x="0" y="150" width="600" height="20" fill="#FF4500" />

      {/* Left tower */}
      <rect x="100" y="50" width="20" height="200" fill="#FF4500" />
      <rect x="90" y="70" width="40" height="20" fill="#FF4500" />

      {/* Right tower */}
      <rect x="480" y="50" width="20" height="200" fill="#FF4500" />
      <rect x="470" y="70" width="40" height="20" fill="#FF4500" />

      {/* Cables */}
      <path d="M110 70 Q300 -50 490 70" fill="none" stroke="#FF4500" strokeWidth="5" />
      <path d="M110 90 Q300 250 490 90" fill="none" stroke="#FF4500" strokeWidth="5" />
    </g>

    {/* Alcatraz */}
    <g transform="translate(650, 180) scale(0.5)">
      <rect x="0" y="0" width="100" height="60" fill="#808080" />
      <rect x="40" y="-20" width="20" height="20" fill="#808080" />
    </g>

    {/* Cable Car */}
    <g>
      <rect x="-60" y="320" width="50" height="30" fill="#8B4513" rx="5" ry="5">
        <animateMotion
          path="M-60 0 H860"
          dur="15s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="-55" y="310" width="40" height="10" fill="#D2691E" rx="2" ry="2">
        <animateMotion
          path="M-60 0 H860"
          dur="15s"
          repeatCount="indefinite"
        />
      </rect>
    </g>

    {/* Seagulls */}
    {[1, 2, 3].map((i) => (
      <path
        key={i}
        d="M0 0 Q5 -5 10 0 Q15 -5 20 0"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        transform={`translate(${i * 100}, ${i * 30}) scale(0.7)`}
      >
        <animateMotion
          path={`M${i * 100} ${i * 30} q ${50 + i * 10} ${-20 - i * 5} ${100 + i * 20} 0`}
          dur={`${5 + i}s`}
          repeatCount="indefinite"
        />
      </path>
    ))}

    {/* Fog */}
    <rect width="800" height="420" fill="url(#fog)" opacity="0.3">
      <animate
        attributeName="opacity"
        values="0.3;0.5;0.3"
        dur="10s"
        repeatCount="indefinite"
      />
    </rect>
    <defs>
      <radialGradient id="fog" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const CairoScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Sky */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    <GlitteringStars />

    {/* Sun */}
    <circle cx="700" cy="80" r="40" fill="#FFD700">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Pyramids */}
    <polygon points="200,350 300,200 400,350" fill="#a0a0a0" />
    <polygon points="350,350 450,180 550,350" fill="#b0b0b0" />
    <polygon points="500,350 600,220 700,350" fill="#a0a0a0" />

    {/* Ground */}
    <rect x="0" y="350" width="800" height="70" fill="#b0b0b0" />

    {/* Palm Trees */}
    {[100, 600].map((x, i) => (
      <g key={i}>
        <rect x={x - 5} y={300} width="10" height="50" fill="#606060" />
        <path d={`M${x} 300 C${x - 20} 280 ${x - 40} 290 ${x - 60} 320`} fill="none" stroke="#808080" strokeWidth="5" />
        <path d={`M${x} 300 C${x + 20} 280 ${x + 40} 290 ${x + 60} 320`} fill="none" stroke="#808080" strokeWidth="5" />
        <path d={`M${x} 300 C${x - 10} 270 ${x} 260 ${x + 10} 270`} fill="none" stroke="#808080" strokeWidth="5" />
      </g>
    ))}

    {/* Camels */}
    <g>
      <path d="M-60 340 Q-40 320 -20 340 Q0 360 20 340 L40 340 L30 320 L40 330 L50 320 L40 340 L60 340" fill="#c00000" stroke="#800000" strokeWidth="2">
        <animateMotion
          path="M-60 0 H860"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <g>
      <path d="M860 340 Q840 320 820 340 Q800 360 780 340 L760 340 L770 320 L760 330 L750 320 L760 340 L740 340" fill="#c00000" stroke="#800000" strokeWidth="2">
        <animateMotion
          path="M860 0 H-60"
          dur="25s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
)

const RomeScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Sky */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    <GlitteringStars />

    {/* Sun */}
    <circle cx="700" cy="80" r="40" fill="#FFD700">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Colosseum */}
    <g transform="translate(200, 50) scale(1.2)">
      <ellipse cx="150" cy="200" rx="150" ry="50" fill="#a0a0a0" />
      <path d="M0 200 Q 75 100 150 200 Q 225 100 300 200" fill="none" stroke="#808080" strokeWidth="10" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i * 50} y="150" width="10" height="50" fill="#909090" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={i * 75 + 37.5} cy="125" rx="30" ry="15" fill="none" stroke="#808080" strokeWidth="5" />
      ))}
    </g>

    {/* Ground */}
    <rect x="0" y="350" width="800" height="70" fill="#b0b0b0" />

    {/* Trees */}
    {[50, 700].map((x, i) => (
      <g key={i}>
        <rect x={x - 5} y={300} width="10" height="50" fill="#606060" />
        <circle cx={x} cy={300} r="20" fill="#808080" />
      </g>
    ))}

    {/* Vespa Scooters */}
    <g>
      <rect x="-40"        y="330" width="30" height="20" fill="#FF4500" rx="5" ry="5">
        <animateMotion
          path="M-40 0 H840"
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g>
      <rect x="-40" y="330" width="30" height="20" fill="#4169E1" rx="5" ry="5">
        <animateMotion
          path="M840 0 H-40"
          dur="13s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  </svg>
)

const ParisScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Sky */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    <GlitteringStars />

    {/* Sun */}
    <circle cx="700" cy="80" r="40" fill="#FFD700">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Eiffel Tower */}
    <g transform="translate(350, 50) scale(0.5, 0.8)">
     {/* Base */}
     <path d="M150 300 L50 300 L75 200 L125 200 Z" fill="#909090" />
     <path d="M150 300 L250 300 L225 200 L175 200 Z" fill="#a0a0a0" />

     {/* Middle section */}
     <path d="M85 200 L215 200 L180 100 L120 100 Z" fill="#b0b0b0" />

     {/* Upper section */}
     <path d="M100 100 L200 100 L170 30 L130 30 Z" fill="#c0c0c0" />

     {/* Top */}
     <rect x="145" y="0" width="10" height="30" fill="#d0d0d0" />

     {/* Cross beams */}
     <line x1="50" y1="300" x2="250" y2="300" stroke="#808080" strokeWidth="5" />
     <line x1="70" y1="250" x2="230" y2="250" stroke="#808080" strokeWidth="3" />
     <line x1="85" y1="200" x2="215" y2="200" stroke="#808080" strokeWidth="2" />
     <line x1="100" y1="150" x2="200" y2="150" stroke="#808080" strokeWidth="2" />
     <line x1="115" y1="100" x2="185" y2="100" stroke="#808080" strokeWidth="2" />
   </g>

    {/* Ground */}
    <rect x="0" y="330" width="800" height="90" fill="#b0b0b0" />

    {/* Trees */}
    {[100, 600].map((x, i) => (
      <g key={i}>
        <rect x={x - 5} y={280} width="10" height="50" fill="#606060" />
        <circle cx={x} cy={280} r="20" fill="#808080" />
      </g>
    ))}

    {/* Cars */}
    <g>
      <rect x="-60" y="310" width="50" height="25" fill="#4169E1" rx="5" ry="5">
        <animateMotion
          path="M-60 0 H860"
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g>
      <rect x="-60" y="310" width="50" height="25" fill="#FF4500" rx="5" ry="5">
        <animateMotion
          path="M860 0 H-60"
          dur="10s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  </svg>
)

const MoonScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Space background */}
    <rect width="800" height="420" fill="#111111" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>
    {/* Stars */}
    <GlitteringStars />

    {/* Moon surface */}
    <path d="M0 400 Q 400 200 800 400" fill="#c0c0c0" />

    {/* Moon craters */}
    <circle cx="150" cy="380" r="15" fill="#a0a0a0" />
    <circle cx="300" cy="390" r="10" fill="#a0a0a0" />
    <circle cx="450" cy="385" r="12" fill="#a0a0a0" />
    <circle cx="600" cy="375" r="8" fill="#a0a0a0" />
    <circle cx="700" cy="390" r="10" fill="#a0a0a0" />

    {/* Earth in the sky */}
    <circle cx="700" cy="80" r="40" fill="#4169E1">
      <animate
        attributeName="opacity"
        values="0.7;1;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Astronauts */}
    <g>
      <path d="M-20 390 Q-10 370 0 390 Q10 410 20 390 L30 390 L25 380 L30 385 L35 380 L30 390 L40 390" fill="#ffffff" stroke="#c0c0c0" strokeWidth="2">
        <animateMotion
          path="M-20 0 Q 400 -100 820 0"
          dur="20s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <g>
      <path d="M820 380 Q830 360 840 380 Q850 400 860 380 L870 380 L865 370 L870 375 L875 370 L870 380 L880 380" fill="#ffffff" stroke="#c0c0c0" strokeWidth="2">
        <animateMotion
          path="M820 0 Q 400 -100 -20 0"
          dur="25s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  </svg>
)

const UnderwaterScene = () => (
  <svg className="w-full h-full" viewBox="0 0 800 420">
    {/* Water background */}
    <rect width="800" height="420" fill="#4a4a4a" />
    <text x="10" y="20" fill="#ffffff" fontSize="14" fontFamily="monospace">01001100 01001001 01000110 01000101</text>

    {/* Sunlight rays */}
    {[1, 2, 3, 4, 5].map((i) => (
      <path
        key={i}
        d={`M${i * 160 - 80} 0 L${i * 160 - 160} 400 M${i * 160 - 80} 0 L${i * 160} 400`}
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.2"
      >
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur={`${3 + i}s`}
          repeatCount="indefinite"
        />
      </path>
    ))}

    {/* Seaweed */}
    {[1, 2, 3, 4].map((i) => (
      <path
        key={i}
        d={`M${i * 200 - 150} 400 Q${i * 200 - 100} 300 ${i * 200 - 150} 200 Q${i * 200 - 200} 100 ${i * 200 - 150} 0`}
        fill="none"
        stroke="#808080"
        strokeWidth="10"
      >
        <animate
          attributeName="d"
          values={`M${i * 200 - 150} 400 Q${i * 200 - 100} 300 ${i * 200 - 150} 200 Q${i * 200 - 200} 100 ${i * 200 - 150} 0;
                   M${i * 200 - 150} 400 Q${i * 200 - 200} 300 ${i * 200 - 150} 200 Q${i * 200 - 100} 100 ${i * 200 - 150} 0;
                   M${i * 200 - 150} 400 Q${i * 200 - 100} 300 ${i * 200 - 150} 200 Q${i * 200 - 200} 100 ${i * 200 - 150} 0`}
          dur="10s"
          repeatCount="indefinite"
        />
      </path>
    ))}

    {/* Fish */}
    {[1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <path
          d={`M0 0 Q 10 -15 20 0 Q 10 15 0 0`}
          fill={`hsl(${i * 60}, 70%, 50%)`}
          stroke={`hsl(${i * 60}, 80%, 40%)`}
          strokeWidth="2"
        >
          <animateMotion
            path={`M${-50 + i * 100} ${50 + i * 50} q ${200 + i * 50} ${100 - i * 50} ${400 + i * 100} 0`}
            dur={`${15 + i * 2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur={`${3 + i}s`}
            repeatCount="indefinite"
          />
        </path>
        <circle
          r="2"
          fill="#000000"
        >
          <animateMotion
            path={`M${-30 + i * 100} ${50 + i * 50} q ${200 + i * 50} ${100 - i * 50} ${400 + i * 100} 0`}
            dur={`${15 + i * 2}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    ))}

    {/* Bubbles */}
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <circle
        key={i}
        r={2 + i}
        fill="#c0c0c0"
        opacity="0.3"
      >
        <animateMotion
          path={`M${100 * i} 400 q ${-20 + i * 5} ${-200 - i * 20} 0 ${-400 - i * 20}`}
          dur={`${10 + i * 2}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.5;0.3"
          dur={`${4 + i}s`}
          repeatCount="indefinite"
        />
      </circle>
    ))}
  </svg>
)

const scenes = ['london', 'sanfrancisco', 'cairo', 'rome', 'paris', 'moon', 'underwater']

const preventDefault = (e: Event) => {
  e.preventDefault();
};

export default function Component() {
  const svgRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [currentScene, setCurrentScene] = useState<'london' | 'sanfrancisco' | 'cairo' | 'rome' | 'paris' | 'moon' | 'underwater'>('london');

  useEffect(() => {
        const canvas = canvasRef.current
    const div = svgRef.current
    if (!canvas || !div) return

    const ctx = canvas.getContext('2d')
    if  (!ctx) return

    const updateCanvasSize = () => {
      const rect = div.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const drawXRayEffect = (x: number, y: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, 50, 0, Math.PI * 2)
      ctx.clip()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px monospace'
      const startX = Math.floor(x / 20) * 20 - 60
      const startY = Math.floor(y / 20) * 20 - 60
      for (let i = startX; i < startX + 120; i += 20) {
        for (let j = startY; j < startY + 120; j += 20) {
          ctx.fillText(Math.random() > 0.5 ? '1' : '0', i, j)
        }
      }

      ctx.restore()
    }

    if (mousePos) {
      drawXRayEffect(mousePos.x, mousePos.y)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Add event listeners to prevent default touch behavior
    const divElement = svgRef.current;
    if (divElement) {
      divElement.addEventListener('touchstart', preventDefault, { passive: false });
      divElement.addEventListener('touchmove', preventDefault, { passive: false });
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize)

      // Remove event listeners
      if (divElement) {
        divElement.removeEventListener('touchstart', preventDefault);
        divElement.removeEventListener('touchmove', preventDefault);
      }
    }
  }, [mousePos])

  const handleInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    setMousePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    })
  }

  const handleInteractionEnd = () => {
    setMousePos(null)
  }

  const handleRefresh = () => {
    const availableScenes = scenes.filter(scene => scene !== currentScene) as ('london' | 'sanfrancisco' | 'cairo' | 'rome' | 'paris' | 'moon' | 'underwater')[]
    const newScene = availableScenes[Math.floor(Math.random() * availableScenes.length)]
    setCurrentScene(newScene)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div 
        className="relative w-full max-w-3xl h-[420px]" 
        ref={svgRef} 
        onMouseMove={handleInteraction}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteraction}
        onTouchMove={handleInteraction}
        onTouchEnd={handleInteractionEnd}
        style={{ touchAction: 'none' }}
      >
        {currentScene === 'london' && <LondonScene />}
        {currentScene === 'sanfrancisco' && <SanFranciscoScene />}
        {currentScene === 'cairo' && <CairoScene />}
        {currentScene === 'rome' && <RomeScene />}
        {currentScene === 'paris' && <ParisScene />}
        {currentScene === 'moon' && <MoonScene />}
        {currentScene === 'underwater' && <UnderwaterScene />}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
      <div className="mt-4">
        <Button onClick={handleRefresh} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}