"use client"

import { useEffect, useState, useRef, useCallback } from 'react'

export default function Component() {
  const [sandHeight, setSandHeight] = useState(0)
  const [textParticles, setTextParticles] = useState<{ char: string; x: number; y: number; delay: number; duration: number; finalX: number; finalY: number; id: number }[]>([])
  const [cycleCount, setCycleCount] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<'text' | 'hourglass' | 'reset'>('text')
  const svgRef = useRef<SVGSVGElement>(null)

  const initializeParticles = useCallback(() => {
    const text = [
      "Let me tell you what I wish I'd known",
      "When I was young and dreamed of glory:",
      "You have no control:",
      "",
      "Who lives, who dies, who tells your story",
      "",
      "I know that we can win",
      "I know that greatness lies in you",
      "But remember from here on in",
      "",
      "History has its",
      "Eyes on you"
    ]

    let particleIndex = 0
    const particles = text.flatMap((line, lineIndex) => 
      line.split('').map((char, charIndex) => {
        const x = 250 + (charIndex - line.length / 2) * 10
        const y = 30 + lineIndex * 20
        return {
          char,
          x,
          y,
          delay: 2 + Math.random() * 3,
          duration: 2 + Math.random() * 2,
          finalX: x + (Math.random() - 0.5) * 200,
          finalY: 600 + Math.random() * 100,
          id: particleIndex++
        }
      })
    )
    setTextParticles(particles)
  }, [])

  useEffect(() => {
    initializeParticles()
  }, [initializeParticles, cycleCount])

  useEffect(() => {
    if (svgRef.current && textParticles.length > 0) {
      const svg = svgRef.current
      textParticles.forEach((particle) => {
        const textElement = svg.querySelector(`#text-${particle.id}`) as SVGTextElement
        if (textElement) {
          textElement.style.animation = `fallLikeSand ${particle.duration * 5}s ease-in ${particle.delay}s forwards`
          textElement.style.setProperty('--finalX', `${particle.finalX - particle.x}px`)
          textElement.style.setProperty('--finalY', `${particle.finalY - particle.y}px`)
        }
      })

      const maxDuration = Math.max(...textParticles.map(p => (p.duration * 5) + p.delay)) * 1000
      const timer = setTimeout(() => {
        setAnimationPhase('hourglass')
      }, maxDuration + 1000) // Add 1 second buffer

      return () => clearTimeout(timer)
    }
  }, [textParticles])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (animationPhase === 'hourglass') {
      interval = setInterval(() => {
        setSandHeight((prevHeight) => {
          if (prevHeight >= 100) {
            clearInterval(interval!)
            setAnimationPhase('reset')
            return 0
          }
          return prevHeight + 1
        })
      }, 50)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [animationPhase])

  useEffect(() => {
    if (animationPhase === 'reset') {
      const timer = setTimeout(() => {
        setCycleCount(prev => prev + 1)
        setAnimationPhase('text')
        setSandHeight(0) // Reset sand height
      }, 2000) // Wait 2 seconds before resetting

      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rokkitt&display=swap');
        @keyframes fallLikeSand {
          0%, 80% { transform: translate(0, 0); opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(var(--finalX), var(--finalY)); opacity: 0; }
        }
        @keyframes resetText {
          0% { transform: translate(var(--finalX), var(--finalY)); opacity: 0; }
          100% { transform: translate(0, 0); opacity: 1; }
        }
      `}</style>
      <svg ref={svgRef} width="500" height="700" viewBox="0 0 500 700">
        {/* Text particles */}
        {textParticles.map((particle) => (
          <text
            key={`${particle.id}-${cycleCount}`}
            id={`text-${particle.id}`}
            x={particle.x}
            y={particle.y}
            fontFamily="Rokkitt, serif"
            fontSize="14"
            fill="#f6d55c"
            style={{
              animation: animationPhase === 'reset' 
                ? `resetText 1s ease-out forwards`
                : undefined,
              '--finalX': `${particle.finalX - particle.x}px`,
              '--finalY': `${particle.finalY - particle.y}px`,
              letterSpacing: "1px",
            }}
          >
            {particle.char}
          </text>
        ))}

        <g transform="translate(150, 350)">
          <defs>
            <clipPath id="hourglassClip">
              <path d="M50 0 L150 0 L100 150 L150 300 L50 300 L100 150 Z" />
            </clipPath>
            <pattern id="sandPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#f6d55c" />
              <circle cx="2" cy="2" r="1" fill="#e6c54c" />
              <circle cx="7" cy="8" r="1.5" fill="#d6b53c" />
            </pattern>
          </defs>

          <g clipPath="url(#hourglassClip)">
            {/* Top half of the sand */}
            <rect x="50" y="0" width="100" height={150 - (sandHeight * 1.5)} fill="url(#sandPattern)" />
            
            {/* Bottom half of the sand */}
            <rect x="50" y={300 - sandHeight * 1.5} width="100" height={sandHeight * 1.5} fill="url(#sandPattern)" />
            
            {/* Middle section (narrow part) */}
            <circle cx="100" cy="150" r="5" fill="url(#sandPattern)" />
            
            {/* Falling sand particles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <circle
                key={i}
                cx={95 + Math.random() * 10}
                cy={(sandHeight * 3) % 300}
                r={1 + Math.random()}
                fill="#d6b53c"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}