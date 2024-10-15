"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function MikeWazowskiSoundWaveSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const barWidth = 4
    const gap = 2
    const totalBars = Math.floor(canvas.width / (barWidth + gap))
    const barHeights = Array(totalBars).fill(0).map(() => Math.random() * 0.8 + 0.2)

    const draw = () => {
      if (!canvas || !ctx) return

      ctx.fillStyle = 'rgb(0, 0, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgb(255, 255, 255)'

      for (let i = 0; i < totalBars; i++) {
        const x = i * (barWidth + gap)
        let height

        if (isAnimating) {
          const time = Date.now() / 1000
          const frequency = 5 + barHeights[i] * 10
          const amplitude = canvas.height * barHeights[i]
          height = Math.abs(Math.sin(time * frequency)) * amplitude
        } else {
          height = barHeights[i] * canvas.height / 4
        }

        ctx.fillRect(x, canvas.height / 2 - height / 2, barWidth, height)
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isAnimating])

  const startAnimation = () => setIsAnimating(true)
  const stopAnimation = () => setIsAnimating(false)

  const preventDefaultTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center" 
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0"
      />
      <div 
        className="absolute bottom-8 z-10 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        onMouseDown={startAnimation}
        onMouseUp={stopAnimation}
        onMouseLeave={stopAnimation}
        onTouchStart={(e) => {
          preventDefaultTouch(e)
          startAnimation()
        }}
        onTouchEnd={(e) => {
          preventDefaultTouch(e)
          stopAnimation()
        }}
        onTouchMove={preventDefaultTouch}
        onContextMenu={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label="Press to simulate sound"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            startAnimation()
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            stopAnimation()
          }
        }}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <Image
          src={isAnimating 
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wazowski-scream-CUtWoE1tMnDZT7N3o2obthuUkd7Zci.png"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wazowski-normal-W6vPWkjMAeoX9aRKfH5kCKMoudk9P9.png"
          }
          alt={isAnimating ? "Mike Wazowski screaming" : "Mike Wazowski normal"}
          width={150}
          height={150}
          className="select-none pointer-events-none"
          unoptimized
          loading="eager"
          draggable={false}
        />
      </div>
    </div>
  )
}