'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Young_Serif } from 'next/font/google'

const youngSerif = Young_Serif({ subsets: ['latin'], weight: '400' })

const poemLines = [
  "I, remember, too, the times I remembered you.",
  "as I put water into the kettle or",
  "picked up the little broken spoon from within",
  "the sugar pot",
  "both acts, I agree, too mundane to mention,",
  "alas, these too, i'm left, alone, to do.",
  "I remember; I've remembered you."
]

export default function Component() {
  const [isPouring, setIsPouring] = useState(false)
  const [kettleWaterLevel, setKettleWaterLevel] = useState(100)
  const [currentCup, setCurrentCup] = useState({ id: 1, waterLevel: 0 })
  const [filledCups, setFilledCups] = useState<{ id: number; waterLevel: number }[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [revealedLines, setRevealedLines] = useState(0)

  const handlePour = () => {
    if (kettleWaterLevel > 0 && !isTransitioning) {
      setIsPouring(true)
    }
  }

  const handleStopPour = () => {
    setIsPouring(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPouring && kettleWaterLevel > 0 && !isTransitioning) {
      interval = setInterval(() => {
        setKettleWaterLevel((prevLevel) => {
          const newLevel = prevLevel - 1;
          setCurrentCup((prevCup) => {
            const newCupLevel = Math.min(prevCup.waterLevel + 1, 100);
            setRevealedLines(Math.floor((100 - newLevel) / (100 / poemLines.length)));
            if (newCupLevel === 100) {
              setIsTransitioning(true);
              setTimeout(() => {
                setFilledCups((prev) => [...prev, { ...prevCup, waterLevel: newCupLevel }]);
                setKettleWaterLevel(100);
                setCurrentCup({ id: prevCup.id + 1, waterLevel: 0 });
                setIsTransitioning(false);
                setRevealedLines(0);
              }, 1000);
            }
            return { ...prevCup, waterLevel: newCupLevel };
          });
          if (newLevel <= 0) {
            setIsPouring(false);
            return 0;
          }
          return newLevel;
        });
      }, 50);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPouring, kettleWaterLevel, isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handlePour();
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-[#DDF3F5] p-4 overflow-hidden">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-md">
        <div className="text-center mb-4 h-1/3 overflow-y-auto">
          {kettleWaterLevel < 100 && poemLines.map((line, index) => (
            <p 
              key={index} 
              className={`text-sm mb-1 transition-opacity duration-300 ${youngSerif.className} ${index < revealedLines ? 'opacity-100' : 'opacity-0'}`}
            >
              {line}
            </p>
          ))}
        </div>
        <div className="relative mb-4">
          <div 
            className={`w-20 h-20 transition-transform duration-300 ease-in-out ${isPouring ? 'rotate-[135deg]' : ''}`}
            onMouseDown={handlePour}
            onMouseUp={handleStopPour}
            onMouseLeave={handleStopPour}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleStopPour}
            onTouchMove={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              KhtmlUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'manipulation',
            }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kettle-svgrepo-com-aQbGS91eCtz53dtnE3k77dgwWRdECl.png"
              alt="Silhouette of a kettle with a long spout and handle"
              width={80}
              height={80}
              className="w-full h-full object-contain select-none pointer-events-none"
              priority
            />
          </div>
          {isPouring && kettleWaterLevel > 0 && (
            <div 
              className="absolute top-[60px] left-[40px] w-1 bg-blue-500 rounded-full animate-pour" 
              style={{ height: `${kettleWaterLevel * 0.6}px` }}
            ></div>
          )}
        </div>
        <div className="relative w-20 h-20 overflow-hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-cup-coffee-svgrepo-com-pwkjtC2j8FPf1rCnIZAQlSSclaEkmw.png"
            alt={`Silhouette of coffee cup ${currentCup.id}`}
            width={80}
            height={80}
            className="w-full h-full object-contain"
            priority
          />
          <div 
            className="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
            style={{ 
              height: `${100 - currentCup.waterLevel}%`,
              backgroundColor: '#DDF3F5'  // Match the page background color
            }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-end w-full mt-4 h-1/6 overflow-y-auto">
        {filledCups.map((cup) => (
          <div key={cup.id} className="w-6 h-6 relative overflow-hidden m-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/coffee-cup-coffee-svgrepo-com-pwkjtC2j8FPf1rCnIZAQlSSclaEkmw.png"
              alt={`Filled coffee cup ${cup.id}`}
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}