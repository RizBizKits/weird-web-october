'use client'

import { useState, useEffect, useRef } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface Face {
  expression: string
  eyebrows: string
  mouth: string
  positive: boolean
}

interface FaceState {
  expression: string
  x: number
  y: number
  vx: number
  vy: number
  scale: number
}

const FACE_SIZE = 100
const CONTAINER_PADDING = 24
const ANIMATION_DURATION = 10000 // 10 seconds

export default function Component() {
  const [faceStates, setFaceStates] = useState<FaceState[]>([])
  const [isReacting, setIsReacting] = useState(false)
  const [isSettling, setIsSettling] = useState(false)
  const [showThumbs, setShowThumbs] = useState(false)
  const [fadeToBlack, setFadeToBlack] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showUnderline, setShowUnderline] = useState(false)
  const [renderOverlay, setRenderOverlay] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const faces: Face[] = [
    { expression: 'happy', eyebrows: 'M25 20 Q32.5 15 40 20', mouth: 'M30 70 Q50 80 70 70', positive: true },
    { expression: 'overjoyed', eyebrows: 'M25 15 Q32.5 10 40 15', mouth: 'M30 65 Q50 90 70 65', positive: true },
    { expression: 'surprised', eyebrows: 'M25 15 Q32.5 5 40 15', mouth: 'M35 70 Q50 85 65 70', positive: true },
    { expression: 'shocked', eyebrows: 'M25 10 Q32.5 0 40 10', mouth: 'M35 75 Q50 90 65 75', positive: false },
    { expression: 'sad', eyebrows: 'M25 30 Q32.5 35 40 30', mouth: 'M30 75 Q50 65 70 75', positive: false },
    { expression: 'depressed', eyebrows: 'M25 35 Q32.5 40 40 35', mouth: 'M30 80 Q50 70 70 80', positive: false },
    { expression: 'angry', eyebrows: 'M25 25 Q32.5 15 40 25', mouth: 'M30 75 Q50 80 70 75', positive: false },
    { expression: 'furious', eyebrows: 'M25 20 Q32.5 10 40 20', mouth: 'M30 80 Q50 85 70 80', positive: false },
    { expression: 'neutral', eyebrows: 'M25 25 L40 25', mouth: 'M30 70 H70', positive: true },
    { expression: 'confused', eyebrows: 'M25 20 Q32.5 25 40 20', mouth: 'M30 70 Q40 75 50 70 Q60 65 70 70', positive: false },
    { expression: 'skeptical', eyebrows: 'M25 25 L40 20', mouth: 'M30 70 Q45 65 70 70', positive: false },
    { expression: 'amused', eyebrows: 'M25 22 Q32.5 18 40 22', mouth: 'M30 68 Q50 75 70 68', positive: true },
    { expression: 'embarrassed', eyebrows: 'M25 28 Q32.5 32 40 28', mouth: 'M30 75 Q50 78 70 75', positive: false },
    { expression: 'proud', eyebrows: 'M25 18 L40 22', mouth: 'M30 65 Q50 60 70 65', positive: true },
    { expression: 'bored', eyebrows: 'M25 25 L40 25', mouth: 'M30 72 H70', positive: false },
  ]

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight
      const numFaces = 30
      const initialFaces: FaceState[] = Array(numFaces).fill(null).map(() => {
        const expression = faces[Math.floor(Math.random() * faces.length)].expression
        const isThumbsDown = !faces.find(f => f.expression === expression)?.positive
        return {
          expression,
          x: Math.random() * (containerWidth - FACE_SIZE - CONTAINER_PADDING * 2) + CONTAINER_PADDING,
          y: Math.random() * (containerHeight - FACE_SIZE - CONTAINER_PADDING * 2) + CONTAINER_PADDING,
          vx: (Math.random() - 0.5) * 4 * (isThumbsDown ? 1.15 : 1),
          vy: (Math.random() - 0.5) * 4 * (isThumbsDown ? 1.15 : 1),
          scale: isThumbsDown ? 1.2 : 1
        }
      })
      setFaceStates(initialFaces)
    }

    // Start the animation after a 2-second delay
    const timer = setTimeout(() => {
      setIsReacting(true)
      setShowThumbs(true)
    }, 2000)

    // Set fade to black after ANIMATION_DURATION
    const fadeTimer = setTimeout(() => {
      setRenderOverlay(true)
      setTimeout(() => setFadeToBlack(true), 50)
      // Set showText after an additional 1 second
      setTimeout(() => setShowText(true), 1050)
      // Set showUnderline after text appears
      setTimeout(() => setShowUnderline(true), 2050)
    }, ANIMATION_DURATION)

    return () => {
      clearTimeout(timer)
      clearTimeout(fadeTimer)
    }
  }, [])

  useEffect(() => {
    if (isReacting) {
      const interval = setInterval(() => {
        setFaceStates(prevStates =>
          prevStates.map(state => ({
            ...state,
            expression: faces[Math.floor(Math.random() * faces.length)].expression
          }))
        )
      }, 300)

      setTimeout(() => {
        clearInterval(interval)
        setIsReacting(false)
        setIsSettling(true)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isReacting])

  useEffect(() => {
    if (isSettling) {
      const settleNextFace = (index: number) => {
        if (index < faceStates.length) {
          setFaceStates(prevStates => {
            const newStates = [...prevStates]
            newStates[index] = {
              ...newStates[index],
              expression: faces[Math.floor(Math.random() * faces.length)].expression
            }
            return newStates
          })
          setTimeout(() => settleNextFace(index + 1), 100)
        } else {
          setIsSettling(false)
        }
      }

      settleNextFace(0)
    }
  }, [isSettling])

  useEffect(() => {
    const updatePhysics = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight

        setFaceStates(prevStates => {
          return prevStates.map((face, i) => {
            let { x, y, vx, vy, scale } = face

            // Update position
            x += vx
            y += vy

            // Bounce off walls
            if (x <= CONTAINER_PADDING || x >= containerWidth - FACE_SIZE - CONTAINER_PADDING) {
              vx = -vx
              x = Math.max(CONTAINER_PADDING, Math.min(x, containerWidth - FACE_SIZE - CONTAINER_PADDING))
            }
            if (y <= CONTAINER_PADDING || y >= containerHeight - FACE_SIZE - CONTAINER_PADDING) {
              vy = -vy
              y = Math.max(CONTAINER_PADDING, Math.min(y, containerHeight - FACE_SIZE - CONTAINER_PADDING))
            }

            // Check collisions with other faces
            prevStates.forEach((otherFace, j) => {
              if (i !== j) {
                const dx = x - otherFace.x
                const dy = y - otherFace.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < FACE_SIZE * (scale + otherFace.scale) / 2) {
                  // Collision detected, update velocities
                  const angle = Math.atan2(dy, dx)
                  const sin = Math.sin(angle)
                  const cos = Math.cos(angle)

                  // Rotate velocities
                  const vx1 = vx * cos + vy * sin
                  const vy1 = vy * cos - vx * sin
                  const vx2 = otherFace.vx * cos + otherFace.vy * sin
                  const vy2 = otherFace.vy * cos - otherFace.vx * sin

                  // Update velocities
                  vx = vx2 * cos - vy1 * sin
                  vy = vy2 * cos + vx1 * sin

                  // Move faces apart to prevent sticking
                  const moveX = (FACE_SIZE * (scale + otherFace.scale) / 2 - distance) * cos / 2
                  const moveY = (FACE_SIZE * (scale + otherFace.scale) / 2 - distance) * sin / 2
                  x += moveX
                  y += moveY
                }
              }
            })

            if (!faces.find(f => f.expression === face.expression)?.positive) {
              vx *= 1.02;
              vy *= 1.02;
            }

            return { ...face, x, y, vx, vy, scale }
          })
        })
      }
      animationRef.current = requestAnimationFrame(updatePhysics)
    }

    animationRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-slate-100 p-6 overflow-hidden" ref={containerRef}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Script&display=swap');

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes underline {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
      {faceStates.map((faceState, index) => {
        const face = faces.find(f => f.expression === faceState.expression) || faces[0]
        const shake = !face.positive ? `${Math.sin(Date.now() * 0.02) * 0.75}px` : '0px';
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${faceState.x}px`,
              top: `${faceState.y}px`,
              width: `${FACE_SIZE * faceState.scale}px`,
              height: `${FACE_SIZE * faceState.scale}px`,
              transform: `translate(${shake}, ${shake})`,
              transition: 'left 0.1s, top 0.1s, width 0.3s, height 0.3s'
            }}
          >
            <svg
              viewBox="25 25 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-primary"
            >
              <rect x="27" y="27" width="46" height="46" rx="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="40" cy="42" r="2.5" fill="currentColor" />
              <circle cx="60" cy="42" r="2.5" fill="currentColor" />
              <path
                d={face.eyebrows.replace(/\d+/g, m => String(Number(m) / 2 + 25))}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d={face.eyebrows.replace(/\d+/g, m => String(Number(m) / 2 + 25)).replace('42.5', '55').replace('50', '62.5')}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d={face.mouth.replace(/\d+/g, m => String(Number(m) / 2 + 25))}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {showThumbs && (
              <div className="absolute bottom-1 right-1">
                {face.positive ? (
                  <ThumbsUp className="w-4 h-4 text-green-500 fill-current" aria-label="Thumbs up" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-red-500 fill-current" aria-label="Thumbs down" />
                )}
              </div>
            )}
          </div>
        )
      })}
      {renderOverlay && (
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none flex flex-col items-center justify-center" 
          style={{ opacity: fadeToBlack ? 1 : 0 }}
        >
          <h1 
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-league-script transition-opacity duration-1000 relative px-4 text-center"
            style={{ 
              opacity: showText ? 1 : 0,
              fontFamily: "'League Script', cursive",
            }}
          >
            Social Media for  Social Beings
            {showUnderline && (
              <span 
                className="absolute bottom-0 left-0 h-0.5 bg-white"
                style={{
                  animation: 'underline 1s ease-out forwards',
                }}
              />
            )}
          </h1>
        </div>
      )}
    </div>
  )
}