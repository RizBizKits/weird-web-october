'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { VT323 } from 'next/font/google'


const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export default function Component() {
  const [isReady, setIsReady] = useState(false)
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [pickedKeys, setPickedKeys] = useState<Set<string>>(new Set())
  const [displayText, setDisplayText] = useState('')
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    'Backspace', 'Enter', 'Space'
  ]

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 3000)
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard")
      setDisplayText(prev => prev + '\n')
    }).catch(err => {
      console.error('Failed to copy text: ', err)
      showToast("Failed to copy text to clipboard")
    })
  }, [showToast])

  const startTimer = useCallback((key: string) => {
    setPressedKey(key)
    setProgress(0)
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      const elapsedTime = Date.now() - (startTimeRef.current || 0)
      const newProgress = Math.min((elapsedTime / 2000) * 100, 100)
      setProgress(newProgress)
      if (newProgress === 100) {
        clearInterval(timerRef.current!)
        setPickedKeys(prev => new Set(prev).add(key))
        if (key === 'Enter') {
          copyToClipboard(displayText)
        } else {
          updateDisplayText(key)
        }
      }
    }, 20)
  }, [displayText, copyToClipboard])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setPressedKey(null)
    setProgress(0)
  }, [])

  const updateDisplayText = (key: string) => {
    setDisplayText(prev => {
      if (key === 'Space') return prev + ' '
      if (key === 'Backspace') return prev.slice(0, -1)
      return prev + key
    })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleTouchStart = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault()
    startTimer(key)
  }

  const handleMouseDown = (key: string) => () => {
    startTimer(key)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    stopTimer()
  }

  const handleMouseUp = () => {
    stopTimer()
  }

  if (!isReady) {
    return (
      <div className="h-screen bg-black text-[#FFFDE7] flex flex-col items-center justify-center p-4">
       <div className="text-center mb-8">
          <p className={`${vt323.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed`}>
            Words carry weight.
            <br />
            <span className="underline">slowkeyz</span> ensures that you construct your sentences <br />with intention and deliberation.
          </p>
        </div>
        <Button 
          onClick={() => setIsReady(true)}
          className="text-lg px-6 py-3 bg-[#FFFDE7] text-black hover:bg-[#F0F4C3]"
        >
          I am ready
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black p-1 flex flex-col">
      <Card className="mb-4 p-2 h-[100px] flex items-start bg-[#FFFDE7] text-black">
        <pre className="font-mono text-sm sm:text-base break-all whitespace-pre-wrap">
          {displayText || 'Selected letters will appear here'}
        </pre>
      </Card>
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-10 gap-1">
            {keys.slice(0, 10).map((key) => (
              <Card 
                key={key} 
                className={`aspect-square flex flex-col items-center justify-center relative overflow-hidden
                  ${pickedKeys.has(key) ? 'bg-green-200' : 'bg-[#FFFDE7]'}
                  ${key === 'Enter' ? 'col-span-2' : ''}
                  ${key === 'Space' ? 'col-span-5' : ''}
                  cursor-pointer`}
                onTouchStart={handleTouchStart(key)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown(key)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <span 
                  className={`${vt323.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold
                    transition-all duration-[2000ms] ease-in-out
                    ${pressedKey === key || pickedKeys.has(key) ? 'transform -translate-y-1/2' : ''}
                    ${pickedKeys.has(key) ? 'text-green-700' : 'text-gray-800'}`}
                  style={{
                    textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {key === 'Space' ? '␣' : key === 'Backspace' ? '⌫' : key}
                </span>
                {pressedKey === key && (
                  <Progress 
                    value={progress} 
                    className="w-3/4 absolute bottom-0.5 left-1/2 transform -translate-x-1/2"
                    aria-label={`Long press progress for key ${key}`}
                  />
                )}
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1">
            {keys.slice(10, 19).map((key) => (
              <Card 
                key={key} 
                className={`aspect-square flex flex-col items-center justify-center relative overflow-hidden
                  ${pickedKeys.has(key) ? 'bg-green-200' : 'bg-[#FFFDE7]'}
                  ${key === 'Enter' ? 'col-span-2' : ''}
                  ${key === 'Space' ? 'col-span-5' : ''}
                  cursor-pointer`}
                onTouchStart={handleTouchStart(key)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown(key)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <span 
                  className={`${vt323.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold
                    transition-all duration-[2000ms] ease-in-out
                    ${pressedKey === key || pickedKeys.has(key) ? 'transform -translate-y-1/2' : ''}
                    ${pickedKeys.has(key) ? 'text-green-700' : 'text-gray-800'}`}
                  style={{
                    textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {key === 'Space' ? '␣' : key === 'Backspace' ? '⌫' : key}
                </span>
                {pressedKey === key && (
                  <Progress 
                    value={progress} 
                    className="w-3/4 absolute bottom-0.5 left-1/2 transform -translate-x-1/2"
                    aria-label={`Long press progress for key ${key}`}
                  />
                )}
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {keys.slice(19, 26).map((key) => (
              <Card 
                key={key} 
                className={`aspect-square flex flex-col items-center justify-center relative overflow-hidden
                  ${pickedKeys.has(key) ? 'bg-green-200' : 'bg-[#FFFDE7]'}
                  ${key === 'Enter' ? 'col-span-2' : ''}
                  ${key === 'Space' ? 'col-span-5' : ''}
                  cursor-pointer`}
                onTouchStart={handleTouchStart(key)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown(key)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <span 
                  className={`${vt323.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold
                    transition-all duration-[2000ms] ease-in-out
                    ${pressedKey === key || pickedKeys.has(key) ? 'transform -translate-y-1/2' : ''}
                    ${pickedKeys.has(key) ? 'text-green-700' : 'text-gray-800'}`}
                  style={{
                    textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {key === 'Space' ? '␣' : key === 'Backspace' ? '⌫' : key}
                </span>
                {pressedKey === key && (
                  <Progress 
                    value={progress} 
                    className="w-3/4 absolute bottom-0.5 left-1/2 transform -translate-x-1/2"
                    aria-label={`Long press progress for key ${key}`}
                  />
                )}
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mt-1">
            {keys.slice(26).map((key) => (
              <Card 
                key={key} 
                className={`flex flex-col items-center justify-center relative overflow-hidden
                  ${pickedKeys.has(key) ? 'bg-green-200' : 'bg-[#FFFDE7]'}
                  ${key === 'Backspace' ? 'col-span-2 h-16' : ''}
                  ${key === 'Enter' ? 'col-span-2 h-16' : ''}
                  ${key === 'Space' ? 'col-span-5 h-16' : ''}
                  cursor-pointer`}
                onTouchStart={handleTouchStart(key)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown(key)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <span 
                  className={`${vt323.className} text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold
                    transition-all duration-[2000ms] ease-in-out
                    ${pressedKey === key || pickedKeys.has(key) ? 'transform -translate-y-1/2' : ''}
                    ${pickedKeys.has(key) ? 'text-green-700' : 'text-gray-800'}`}
                  style={{
                    textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
                  }}
                >
                  {key === 'Space' ? '␣' : key === 'Backspace' ? '⌫' : key}
                </span>
                {pressedKey === key && (
                  <Progress 
                    value={progress} 
                    className="w-3/4 absolute bottom-0.5 left-1/2 transform -translate-x-1/2"
                    aria-label={`Long press progress for key ${key}`}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
      {toast.visible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md">
          {toast.message}
        </div>
      )}
    </div>
  )
}