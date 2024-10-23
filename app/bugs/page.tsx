'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Syne_Tactile } from 'next/font/google'

const syneTactile = Syne_Tactile({ weight: '400', subsets: ['latin'] })

interface Caterpillar {
  id: number
  x: number
  y: number
  speed: number
}

const MemoizedCaterpillar = React.memo(({ x, y }: { x: number; y: number }) => {
  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', left: x, top: y }}
    >
      <circle cx="5" cy="10" r="5" fill="#8BC34A" />
      <circle cx="15" cy="10" r="5" fill="#9CCC65" />
      <circle cx="25" cy="10" r="5" fill="#AED581" />
      <circle cx="35" cy="10" r="5" fill="#C5E1A5" />
      <circle cx="5" cy="5" r="1" fill="black" />
      <path d="M0 10C0 7 2 5 4 6" stroke="black" strokeWidth="0.5" />
    </svg>
  )
})

MemoizedCaterpillar.displayName = 'MemoizedCaterpillar'

export default function CaterpillarTreeGame() {
  const [gameState, setGameState] = useState<'initial' | 'catching' | 'tree-appeared' | 'moving-to-tree' | 'climbing' | 'resetting'>('initial')
  const [leafPosition, setLeafPosition] = useState(0)
  const [caterpillars, setCaterpillars] = useState<Caterpillar[]>([])
  const [caughtCaterpillars, setCaughtCaterpillars] = useState(0)
  const [treePosition, setTreePosition] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const lastTouchMoveTime = useRef(0)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const addCaterpillar = useCallback(() => {
    if (gameState !== 'catching') return
    const newCaterpillar: Caterpillar = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 40),
      y: -50,
      speed: 1 + Math.random() * 2,
    }
    setCaterpillars((prev) => [...prev, newCaterpillar])
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'catching') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setLeafPosition((prev) => Math.max(prev - 20, 0))
      } else if (event.key === 'ArrowRight') {
        setLeafPosition((prev) => Math.min(prev + 20, window.innerWidth - 120))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    const caterpillarInterval = setInterval(addCaterpillar, 2000)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearInterval(caterpillarInterval)
    }
  }, [addCaterpillar, gameState])

  useEffect(() => {
    if (caughtCaterpillars >= 9 && gameState === 'catching') { // Update 1
      setTreePosition(window.innerWidth / 2 - 50)
      setGameState('tree-appeared')
    }
  }, [caughtCaterpillars, gameState])

  useEffect(() => {
    if (gameState === 'tree-appeared' && caughtCaterpillars >= 9) { // Update 2
      const moveLeafToTree = () => {
        setLeafPosition((prev) => {
          const step = prev < treePosition ? 5 : -5;
          const newPosition = prev + step;
          if (Math.abs(newPosition - treePosition) < 5) {
            return treePosition;
          }
          return newPosition;
        });
      };

      const leafMovementInterval = setInterval(moveLeafToTree, 50);

      return () => clearInterval(leafMovementInterval);
    }
  }, [gameState, treePosition, caughtCaterpillars]);

  useEffect(() => {
    if (gameState === 'tree-appeared' && Math.abs(leafPosition - treePosition) < 5) {
      setGameState('moving-to-tree');
      setTimeout(() => {
        setGameState('climbing');
        setTimeout(() => {
          setGameState('resetting');
          setCaughtCaterpillars(0);
          setTimeout(() => {
            setGameState('catching');
          }, 5000);
        }, 2000);
      }, 2000);
    }
  }, [gameState, leafPosition, treePosition]);

  const updateCaterpillars = useCallback(() => {
    setCaterpillars((prevCaterpillars) => {
      let newCaughtCount = 0;
      const updatedCaterpillars = prevCaterpillars.map((caterpillar) => {
        const newY = caterpillar.y + caterpillar.speed;

        if (
          newY > window.innerHeight - 180 &&
          newY < window.innerHeight - 140 &&
          caterpillar.x > leafPosition - 20 &&
          caterpillar.x < leafPosition + 100
        ) {
          newCaughtCount++;
          return null;
        }

        if (newY > window.innerHeight) {
          return null;
        }

        return { ...caterpillar, y: newY };
      }).filter(Boolean) as Caterpillar[];

      if (newCaughtCount > 0) {
        setCaughtCaterpillars((prev) => prev + newCaughtCount);
      }

      return updatedCaterpillars;
    });
  }, [leafPosition, setCaughtCaterpillars])

  useEffect(() => {
    if (gameState !== 'catching') return

    const gameLoop = setInterval(updateCaterpillars, 16)

    return () => clearInterval(gameLoop)
  }, [gameState, updateCaterpillars])

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    setIsTouching(true)
  }, [])

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    const now = Date.now()
    if (now - lastTouchMoveTime.current < 16) return // Throttle to ~60fps
    lastTouchMoveTime.current = now

    if (gameAreaRef.current && isTouching) {
      const touch = event.touches[0]
      const gameArea = gameAreaRef.current.getBoundingClientRect()
      const newPosition = touch.clientX - gameArea.left - 60 // 60 is half the leaf width
      setLeafPosition(Math.max(0, Math.min(newPosition, gameArea.width - 120)))
    }
  }, [isTouching])

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    setIsTouching(false)
  }, [])

  const memoizedCaterpillars = useMemo(() => {
    return caterpillars.map((caterpillar) => (
      <MemoizedCaterpillar key={caterpillar.id} x={caterpillar.x} y={caterpillar.y} />
    ))
  }, [caterpillars])

  if (gameState === 'initial') {
    return <InitialScreen onStart={() => setGameState('catching')} />
  }

  return (
    <div 
      ref={gameAreaRef}
      className="h-screen w-full overflow-hidden bg-gradient-to-b from-sky-700 to-sky-500 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {gameState === 'catching' && memoizedCaterpillars}
      {(gameState === 'catching' || gameState === 'tree-appeared' || gameState === 'moving-to-tree' || gameState === 'climbing') && caughtCaterpillars >= 9 && ( // Update 3
        <Tree x={treePosition} gameState={gameState} />
      )}
      <div
        className="absolute bottom-0 left-0 will-change-transform"
        style={{
          transform: `translateX(${leafPosition}px)`,
          transition: 'transform 0.05s linear',
        }}
      >
        <Leaf caughtCaterpillars={caughtCaterpillars} gameState={gameState} />
      </div>
      <div className={`absolute top-4 left-4 text-2xl font-bold text-white ${syneTactile.className}`}>
        Caught: {caughtCaterpillars}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
        {gameState === 'catching' && (
          <p>{isMobile ? 'Slide your finger left or right to move the leaf and catch caterpillars' : 'Use left and right arrow keys to move the leaf and catch caterpillars'}</p>
        )}
        {gameState === 'tree-appeared' && (
          <p>Move the leaf to the tree to let the caterpillars climb!</p>
        )}
        {gameState === 'moving-to-tree' && (
          <p>The caterpillars are moving to the tree!</p>
        )}
        {gameState === 'climbing' && (
          <p>The caterpillars are climbing the tree!</p>
        )}
        {gameState === 'resetting' && (
          <p>Get ready for the next round!</p>
        )}
      </div>
    </div>
  )
}

function InitialScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className={`h-screen w-full flex flex-col items-center justify-center bg-black text-white ${syneTactile.className}`}>
      <p className="text-2xl text-center mb-8 max-w-md px-4">
        Life's perils are aplenty. Will you be the leaf as it carries falling caterpillars to their abode?
      </p>
      <Button onClick={onStart} className="text-xl px-6 py-3">
        I will
      </Button>
    </div>
  )
}

InitialScreen.displayName = 'InitialScreen'

function Leaf({ caughtCaterpillars, gameState }: { caughtCaterpillars: number; gameState: string }) {
  return (
    <svg
      width="120"
      height="160"
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={gameState === 'catching' ? 'animate-sway' : ''}
    >
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="50%" stopColor="#45a049" />
          <stop offset="100%" stopColor="#3d8b40" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>
      <path
        d="M60 10C30 10 10 50 10 90C10 130 30 150 60 150C90 150 110 130 110 90C110 50 90 10 60 10Z"
        fill="url(#leafGradient)"
        filter="url(#shadow)"
      />
      <path
        d="M60 20C35 20 20 55 20 90C20 125 35 140 60 140C85 140 100 125 100 90C100 55 85 20 60 20Z"
        fill="#66BB6A"
      />
      <path
        d="M60 30C40 30 30 60 30 90C30 120 40 130 60 130C80 130 90 120 90 90C90 60 80 30 60 30Z"
        fill="#81C784"
      />
      <path
        d="M60 40C45 40 40 65 40 90C40 115 45 120 60 120C75 120 80 115 80 90C80 65 75 40 60 40Z"
        fill="#A5D6A7"
      />
      <path d="M59 150L61 150L61 160L59 160L59 150Z" fill="#3E2723" />
      {gameState !== 'climbing' && gameState !== 'resetting' && [...Array(caughtCaterpillars)].map((_, index) => (
        <g key={index} transform={`translate(${30 + (index % 3) * 20}, ${50 + Math.floor(index / 3) * 20})`}>
          <circle cx="5" cy="5" r="5" fill="#8BC34A" />
          <circle cx="2" cy="3" r="1" fill="black" />
        </g>
      ))}
    </svg>
  )
}

Leaf.displayName = 'Leaf'

function Tree({ x, gameState }: { x: number; gameState: string }) {
  return (
    <svg
      width="100"
      height="200"
      viewBox="0 0 100 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', left: x, bottom: 0 }}
    >
      <path d="M45 200V80L20 100L50 20L80 100L55 80V200H45Z" fill="#795548" />
      <circle cx="50" cy="20" r="20" fill="#4CAF50" />
      <circle cx="30" cy="40" r="15" fill="#4CAF50" />
      <circle cx="70" cy="40" r="15" fill="#4CAF50" />
      <circle cx="20" cy="70" r="20" fill="#4CAF50" />
      <circle cx="80" cy="70" r="20" fill="#4CAF50" />
      {(gameState === 'moving-to-tree' || gameState === 'climbing') && [...Array(9)].map((_, index) => (
        <g key={index} className={`animate-caterpillar-${index + 1}`}>
          <circle cx="50" cy="180" r="5" fill="#8BC34A" />
          <circle cx="47" cy="178" r="1" fill="black" />
        </g>
      ))}
    </svg>
  )
}

Tree.displayName = 'Tree'