"use client"

import { useEffect, useState, useRef, useMemo } from 'react'
import { useSpring, animated } from 'react-spring'
import { Kode_Mono } from 'next/font/google'

const kodeMono = Kode_Mono({ subsets: ['latin'] })

export default function ResponsiveVerticalTapeLargerGlowingTextCircle() {
  const [dimensions, setDimensions] = useState({ width: 240, height: 800 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000))
  const containerRef = useRef(null)
  const margin = 20
  const holeRadius = 8
  const holeSpacing = 30
  const rows = 5

  const textParts = [
    "The idea of the API is much older than the term itself.",
    "British computer scientists Maurice Wilkes and David Wheeler worked on a modular software library in the 1940s for EDSAC, an early computer.",
    "The subroutines in this library were stored on punched paper tape organized in a filing cabinet.",
    "This cabinet also contained what Wilkes and Wheeler called a \"library catalog\" of notes about each subroutine and how to incorporate it into a program.",
    "Today, such a catalog would be called an API"
  ]

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({
        width: width < 640 ? width * 0.2 : Math.min(240, width * 0.24),
        height: height
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight
      const progress = Math.min(scrollPosition / maxScroll, 1)
      setScrollProgress(progress)

      if (Math.floor(progress * 10) % 3 === 0) {
        setSeed(Math.floor(Math.random() * 10000))
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const generateHoles = useMemo(() => {
    let holes = []
    const columns = Math.floor((dimensions.height - 2 * margin) / holeSpacing)

    for (let i = 0; i < columns; i++) {
      holes.push(
        <circle
          key={`feed-left-${i}`}
          cx={margin}
          cy={margin + i * holeSpacing}
          r={holeRadius}
          fill="white"
          stroke="black"
        />
      )
      holes.push(
        <circle
          key={`feed-right-${i}`}
          cx={dimensions.width - margin}
          cy={margin + i * holeSpacing}
          r={holeRadius}
          fill="white"
          stroke="black"
        />
      )

      for (let j = 0; j < rows; j++) {
        const random = (seed * (i + 1) * (j + 1)) % 100 / 100
        if (random > 0.75) {
          holes.push(
            <circle
              key={`data-${i}-${j}`}
              cx={margin * 2 + j * holeSpacing}
              cy={margin + i * holeSpacing}
              r={holeRadius}
              fill="black"
            />
          )
        }
      }
    }
    return holes
  }, [dimensions.height, dimensions.width, seed])

  const Tape = () => (
    <svg width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="#f0e68c" stroke="black" />
      {generateHoles}
    </svg>
  )

  const circularTextSpring = useSpring({
    opacity: scrollProgress > 0 && scrollProgress < 0.2 ? 1 : 0,
    transform: `translateY(${Math.max(0, scrollProgress - 0.1) * 500}vh)`,
    config: { tension: 280, friction: 60 },
  })

  const textSprings = textParts.map((_, index) => 
    useSpring({
      opacity: scrollProgress > (index + 1) * 0.15 && scrollProgress < (index + 2) * 0.15 ? 1 : 0,
      transform: `translateY(${(scrollProgress - (index + 1) * 0.15) * 100}vh)`,
      config: { tension: 280, friction: 60 },
    })
  )

  const highlightSpring = useSpring({
    backgroundColor: scrollProgress > 0.8 ? 'rgba(255, 255, 0, 0.3)' : 'rgba(255, 255, 0, 0)',
    config: { tension: 300, friction: 10 },
  })

  const GlowingTextCircle = () => (
    <animated.div 
      style={circularTextSpring} 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full border border-yellow-400 flex items-center justify-center">
        <p className="text-black text-center text-xs sm:text-sm md:text-base z-10 px-4 font-bold relative">
          <span className="absolute inset-0 blur-[2px] text-yellow-400">
            DID YOU KNOW?
          </span>
          DID YOU KNOW?
        </p>
      </div>
    </animated.div>
  )

  return (
    <div className={`h-[600vh] bg-gray-100 ${kodeMono.className}`}>
      <div className="fixed top-0 bottom-0 left-0 w-1/5 sm:w-[36%] pointer-events-none">
        <Tape />
      </div>
      <div className="fixed top-0 left-1/5 sm:left-[36%] right-0 bottom-0 overflow-hidden">
        <div 
          ref={containerRef} 
          className="h-full flex flex-col justify-center relative"
        >
          <GlowingTextCircle />
          {textParts.map((text, index) => (
            <animated.div 
              key={index}
              style={textSprings[index]} 
              className="text-base sm:text-lg md:text-xl lg:text-[1.68rem] font-medium leading-relaxed absolute top-1/2 left-0 right-0 -translate-y-1/2 pl-2 sm:pl-[0.7rem] pr-4 sm:pr-8"
            >
              <div className="bg-gray-100 bg-opacity-90 p-2 sm:p-4 rounded-lg relative">
                {index === textParts.length - 1 ? (
                  <animated.span
                    style={highlightSpring}
                    className="px-1 py-0.5 rounded"
                  >
                    {text}
                  </animated.span>
                ) : text}
              </div>
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  )
}