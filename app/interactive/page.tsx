'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { DM_Mono } from 'next/font/google'

const dmMono = DM_Mono({ weight: '300', style: 'italic', subsets: ['latin'] })

interface CircleData {
  x: number
  y: number
  dx: number
  dy: number
  color: string
  dotCount: number
  isAttractor: boolean
}

interface DotPosition {
  x: number
  y: number
  vx: number
  vy: number
}

const CIRCLE_SIZE = 256
const CIRCLE_RADIUS = CIRCLE_SIZE / 2
const TOTAL_CIRCLES = 6
const REPEL_STRENGTH = 2000
const ATTRACT_STRENGTH = 0.25
const DOT_SIZE = 16
const MAX_SPEED = 15
const FRICTION = 0.95
const DOT_OFFSET = 20; // Adjust this value to change the distance between cursor and dots

const getRandomGrey = () => {
  const shade = Math.floor(Math.random() * 200) + 55; // 55-255 for visible grey shades
  return `rgb(${shade}, ${shade}, ${shade})`;
}

const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 100%, 50%)`
}

const Circle: React.FC<{
  data: CircleData;
  index: number;
  onAttractorEnter: () => void;
  onAttractorLeave: () => void;
}> = ({ data, index, onAttractorEnter, onAttractorLeave }) => {
  const [cursorInCircle, setCursorInCircle] = useState(false)
  const [cursorInAttractor, setCursorInAttractor] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<DotPosition>({ x: CIRCLE_RADIUS, y: CIRCLE_RADIUS, vx: 0, vy: 0 })
  const [dotPositions, setDotPositions] = useState<DotPosition[]>([])
  const circleRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  const initializeDotPositions = useCallback(() => {
    return Array.from({ length: data.dotCount }, () => ({
      x: Math.random() * CIRCLE_SIZE,
      y: Math.random() * CIRCLE_SIZE,
      vx: 0,
      vy: 0
    }))
  }, [data.dotCount])

  useEffect(() => {
    setDotPositions(initializeDotPositions())
  }, [initializeDotPositions])

  const updateDotPositions = useCallback(() => {
    setDotPositions(prevPositions => {
      return prevPositions.map(dot => {
        const dx = cursorPosition.x - dot.x
        const dy = cursorPosition.y - dot.y
        const distSquared = dx * dx + dy * dy
        const dist = Math.sqrt(distSquared)

        let vx, vy;

        if (data.isAttractor) {
          const attractForce = 0.1
          const offsetDistance = 20 // Reduced from 40 to 20
          const angle = Math.atan2(dy, dx)
          const targetX = cursorPosition.x - Math.cos(angle) * offsetDistance
          const targetY = cursorPosition.y - Math.sin(angle) * offsetDistance
          vx = (targetX - dot.x) * attractForce
          vy = (targetY - dot.y) * attractForce
        } else {
          const repelForce = REPEL_STRENGTH / (distSquared + 1)
          vx = dot.vx - (dx / dist) * repelForce
          vy = dot.vy - (dy / dist) * repelForce

          const speed = Math.sqrt(vx * vx + vy * vy)
          if (speed > MAX_SPEED) {
            vx = (vx / speed) * MAX_SPEED
            vy = (vy / speed) * MAX_SPEED
          }
        }

        let newX = dot.x + vx
        let newY = dot.y + vy

        // Keep dots within the circle
        const dotDistanceFromCenter = Math.sqrt((newX - CIRCLE_RADIUS) ** 2 + (newY - CIRCLE_RADIUS) ** 2)
        if (dotDistanceFromCenter > CIRCLE_RADIUS - DOT_SIZE / 2) {
          const angle = Math.atan2(newY - CIRCLE_RADIUS, newX - CIRCLE_RADIUS)
          newX = CIRCLE_RADIUS + Math.cos(angle) * (CIRCLE_RADIUS - DOT_SIZE / 2)
          newY = CIRCLE_RADIUS + Math.sin(angle) * (CIRCLE_RADIUS - DOT_SIZE / 2)
          
          if (!data.isAttractor) {
            vx *= -0.5
            vy *= -0.5
          }
        }

        return { 
          x: newX, 
          y: newY, 
          vx: data.isAttractor ? vx : vx * FRICTION, 
          vy: data.isAttractor ? vy : vy * FRICTION 
        }
      })
    })

    animationFrameRef.current = requestAnimationFrame(updateDotPositions)
  }, [cursorPosition, data.isAttractor])

  useEffect(() => {
    if (cursorInCircle) {
      updateDotPositions()
    } else {
      setDotPositions(initializeDotPositions())
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [cursorInCircle, updateDotPositions, initializeDotPositions])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (circleRef.current) {
      const rect = circleRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const radius = rect.width / 2 - 2

      let x = e.clientX - rect.left - centerX
      let y = e.clientY - rect.top - centerY

      const distance = Math.sqrt(x * x + y * y)
      if (distance > radius) {
        x = (x / distance) * radius
        y = (y / distance) * radius
      }

      const newX = x + centerX
      const newY = y + centerY
      
      setCursorPosition({ x: newX, y: newY, vx: 0, vy: 0 })
    }
  }, [])

  const handleMouseEnter = () => {
    setCursorInCircle(true)
    if (data.isAttractor) {
      setCursorInAttractor(true)
      onAttractorEnter()
    }
  }

  const handleMouseLeave = () => {
    setCursorInCircle(false)
    if (data.isAttractor) {
      setCursorInAttractor(false)
      onAttractorLeave()
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setDotPositions(initializeDotPositions())
  }

  return (
    <div 
      ref={circleRef}
      className="absolute w-64 h-64 rounded-full border-4 overflow-hidden cursor-none"
      style={{
        transform: `translate(${data.x}px, ${data.y}px)`,
        transition: 'transform 0.1s linear, border-color 0.3s ease',
        zIndex: data.isAttractor ? 20 : 1,
        borderColor: cursorInCircle && data.isAttractor ? 'white' : 'grey',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      aria-label={`${data.isAttractor ? 'Attractor' : 'Repeller'} circle ${index + 1} with a white border. Contains ${data.dotCount} ${data.color} dots. When the cursor enters, a white dot appears and the colored dots ${data.isAttractor ? 'quickly follow it' : 'quickly flee from it'}. When the cursor leaves, the dots return to their original positions.`}
    >
      <div 
        className="absolute inset-0 rounded-full"
        aria-hidden="true"
      />
      {cursorInCircle && (
        <div 
          className="absolute w-4 h-4 bg-white rounded-full pointer-events-none z-10"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />
      )}
      {dotPositions.map((position, i) => (
        <div 
          key={i}
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: cursorInAttractor && data.isAttractor ? getRandomColor() : data.color,
            opacity: 1 - (i * 0.5 / data.dotCount),
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function Component() {
  const [circles, setCircles] = useState<CircleData[]>([])
  const [isAttractorActive, setIsAttractorActive] = useState(false)
  const [attractorPosition, setAttractorPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const initialCircles: CircleData[] = []
    const attractorIndex = Math.floor(Math.random() * TOTAL_CIRCLES)
    for (let i = 0; i < TOTAL_CIRCLES; i++) {
      initialCircles.push({
        x: Math.random() * (window.innerWidth - CIRCLE_SIZE),
        y: Math.random() * (window.innerHeight - CIRCLE_SIZE),
        dx: (Math.random() - 0.5) * 2, // Reduced from 4 to 2
        dy: (Math.random() - 0.5) * 2, // Reduced from 4 to 2
        color: getRandomGrey(),
        dotCount: Math.floor(Math.random() * 16) + 15, // Random number between 15 and 30
        isAttractor: i === attractorIndex,
      })
    }
    setCircles(initialCircles)
  }, [])

  useEffect(() => {
    const checkCollision = (circle1: CircleData, circle2: CircleData) => {
      const dx = circle1.x - circle2.x
      const dy = circle1.y - circle2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < CIRCLE_SIZE
    }

    const resolveCollision = (circle1: CircleData, circle2: CircleData) => {
      const dx = circle2.x - circle1.x
      const dy = circle2.y - circle1.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const overlap = CIRCLE_SIZE - distance

      if (overlap > 0) {
        const angle = Math.atan2(dy, dx)
        const moveX = overlap * Math.cos(angle) / 2
        const moveY = overlap * Math.sin(angle) / 2

        circle1.x -= moveX
        circle1.y -= moveY
        circle2.x += moveX
        circle2.y += moveY

        const tempDx = circle1.dx
        const tempDy = circle1.dy
        circle1.dx = circle2.dx
        circle1.dy = circle2.dy
        circle2.dx = tempDx
        circle2.dy = tempDy
      }
    }

    const animate = () => {
      const speedFactor = 0.5; // Add this line at the beginning of the animate function
      if (!isAttractorActive) {
        setCircles(prevCircles => {
          const newCircles = [...prevCircles]
            
          for (let i = 0; i < newCircles.length; i++) {
            const circle = newCircles[i]
              
            circle.x += circle.dx * speedFactor; // Updated line
            circle.y += circle.dy * speedFactor; // Updated line

            if (circle.x <= 0 || circle.x >= window.innerWidth - CIRCLE_SIZE) {
              circle.dx = -circle.dx
              circle.x = Math.max(0, Math.min(circle.x, window.innerWidth - CIRCLE_SIZE))
            }
            if (circle.y <= 0 || circle.y >= window.innerHeight - CIRCLE_SIZE) {
              circle.dy = -circle.dy
              circle.y = Math.max(0, Math.min(circle.y, window.innerHeight - CIRCLE_SIZE))
            }

            for (let j = i + 1; j < newCircles.length; j++) {
              if (checkCollision(circle, newCircles[j])) {
                resolveCollision(circle, newCircles[j])
              }
            }
          }

          return newCircles
        })
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAttractorActive])

  const handleAttractorEnter = useCallback((x: number, y: number) => {
    setIsAttractorActive(true)
    setAttractorPosition({ x, y })
  }, [])

  const handleAttractorLeave = useCallback(() => {
    setIsAttractorActive(false)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      {circles.map((circle, index) => (
        <Circle 
          key={index} 
          data={circle} 
          index={index} 
          onAttractorEnter={() => handleAttractorEnter(circle.x, circle.y)}
          onAttractorLeave={handleAttractorLeave}
        />
      ))}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          opacity: isAttractorActive ? 1 : 0,
          zIndex: 15,
          maskImage:  isAttractorActive ? `radial-gradient(circle at ${attractorPosition.x + CIRCLE_SIZE/2}px ${attractorPosition.y + CIRCLE_SIZE/2}px, transparent ${CIRCLE_SIZE/2}px, black ${CIRCLE_SIZE/2}px)` : 'none',
          WebkitMaskImage:  isAttractorActive ? `radial-gradient(circle at ${attractorPosition.x + CIRCLE_SIZE/2}px ${attractorPosition.y + CIRCLE_SIZE/2}px, transparent ${CIRCLE_SIZE/2}px, black ${CIRCLE_SIZE/2}px)` : 'none',
        }}
        aria-hidden="true"
      />
      {isAttractorActive && (
        <div 
          className={`absolute inset-0 flex items-center justify-center text-center p-4 pointer-events-none ${dmMono.className}`}
          style={{
            zIndex: 30,
            color: 'white',
            fontSize: '36px',
            lineHeight: '1.2',
            textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)',
            opacity: 0.9,
          }}
        >
          <p className="max-w-2xl">
            "If you're ever tired of being known for who you know, you know, you'll always know me"
          </p>
        </div>
      )}
    </div>
  )
}