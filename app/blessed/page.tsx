'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'

const playfair = Playfair_Display({ subsets: ['latin'] })

interface Raindrop {
  id: number
  x: number
  y: number
  speed: number
  size: number
  bouncing: boolean
  bounceX: number
  bounceY: number
  bounceSpeed: number
}

export default function UmbrellaCursorRainfall() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [lightning, setLightning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const raindropsRef = useRef<Raindrop[]>([])
  const umbrellaSize = 48
  const umbrellaWidth = umbrellaSize * 1.5
  const umbrellaHeight = umbrellaSize * 0.75

  const createRaindrop = useCallback((): Raindrop => {
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * -100,
      speed: Math.random() * 2 + 3,
      size: Math.random() * 2 + 1,
      bouncing: false,
      bounceX: 0,
      bounceY: 0,
      bounceSpeed: 0
    }
  }, [])

  const isUnderUmbrella = useCallback((x: number, y: number) => {
    const dx = Math.abs(x - cursor.x)
    const dy = y - cursor.y
    return dx < umbrellaWidth / 2 && dy > 0 && dy < umbrellaHeight + dx * (umbrellaHeight / (umbrellaWidth / 2))
  }, [cursor, umbrellaWidth, umbrellaHeight])

  const updateRaindrops = useCallback(() => {
    raindropsRef.current = raindropsRef.current.map(drop => {
      if (drop.bouncing) {
        drop.bounceY += drop.bounceSpeed
        drop.bounceSpeed += 0.2 // Gravity effect
        drop.bounceX += Math.random() * 0.4 - 0.2 // Slight horizontal movement
        if (drop.bounceY > 0) {
          return createRaindrop() // Remove bounce effect and create new raindrop
        }
        return { ...drop, bounceX: drop.bounceX, bounceY: drop.bounceY, bounceSpeed: drop.bounceSpeed }
      }

      const newY = drop.y + drop.speed

      if (isUnderUmbrella(drop.x, newY)) {
        // Start bouncing effect
        return { 
          ...drop, 
          bouncing: true, 
          bounceX: 0,
          bounceY: -Math.random() * 5 - 3, // Initial upward bounce
          bounceSpeed: -Math.random() * 0.5 - 0.5 // Initial upward speed
        }
      }

      return newY > window.innerHeight ? createRaindrop() : { ...drop, y: newY }
    })
  }, [createRaindrop, isUnderUmbrella])

  const drawRaindrops = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (lightning) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx.fillStyle = 'rgba(59, 130, 246, 0.6)' // blue-400 with 60% opacity

    raindropsRef.current.forEach(drop => {
      if (drop.bouncing) {
        ctx.fillRect(drop.x + drop.bounceX, cursor.y + drop.bounceY, drop.size, drop.size)
      } else if (!isUnderUmbrella(drop.x, drop.y)) {
        ctx.fillRect(drop.x, drop.y, drop.size, drop.size * 5)
      }
    })

    if (lightning) {
      drawLightning(ctx)
    }
  }, [cursor, isUnderUmbrella, lightning])

  const drawLightning = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(Math.random() * ctx.canvas.width, 0)

    let y = 0
    while (y < ctx.canvas.height) {
      const x = Math.random() * ctx.canvas.width
      y += Math.random() * 50 + 50
      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }, [])

  const triggerLightning = useCallback(() => {
    setLightning(true)
    setTimeout(() => setLightning(false), 100)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    raindropsRef.current = Array.from({ length: 300 }, createRaindrop)

    const animate = () => {
      updateRaindrops()
      drawRaindrops()
      requestAnimationFrame(animate)
    }

    animate()

    const rainInterval = setInterval(() => {
      const newDrops = Math.floor(Math.random() * 5) + 1
      raindropsRef.current.push(...Array.from({ length: newDrops }, createRaindrop))
    }, Math.random() * 500 + 500)

    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of lightning
        triggerLightning()
      }
    }, 5000)

    return () => {
      clearInterval(rainInterval)
      clearInterval(lightningInterval)
    }
  }, [createRaindrop, updateRaindrops, drawRaindrops, triggerLightning])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-gray-900 cursor-none" 
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className={`max-w-2xl text-gray-500 text-sm sm:text-base px-8 ${playfair.className}`}>
          <p className="whitespace-pre-line">
            {"\"Today,\nat her age, I was driving myself home from yet\nanother spine appointment, singing along\nto some maudlin but solid song on the radio,\nand I saw a mom take her raincoat off\nand give it to her young daughter when\na storm took over the afternoon. My god,\nI thought, my whole life I've been under her\nraincoat thinking it was somehow a marvel\nthat I never got wet.\""}
          </p>
          <p className="mt-4 text-xs sm:text-sm italic">
            <Link href="https://poets.org/poem/raincoat" className="text-gray-400 hover:text-gray-300">
              — The Raincoat, Ada Limón [1976]
            </Link>
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div 
        className="fixed pointer-events-none text-white"
        style={{ 
          left: `${cursor.x}px`, 
          top: `${cursor.y}px`, 
          transform: 'translate(-50%, -50%)' 
        }}
      >
        <svg
          width={umbrellaSize}
          height={umbrellaSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
        </svg>
      </div>
    </div>
  )
}