"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle } from "lucide-react"

export default function Component() {
  const [userInput, setUserInput] = useState("")
  const [words, setWords] = useState<{ text: string; visible: boolean }[]>([])
  const [poemMeaning, setPoemMeaning] = useState("")
  const [isMeaningVisible, setIsMeaningVisible] = useState(false)
  const [isPoetryGenerated, setIsPoetryGenerated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const poetryRef = useRef<HTMLDivElement>(null)
  const meaningRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
  }

  const generateMeaning = (visibleWords: string[]) => {
    const themes = [
      "progress", "efficiency", "adaptation", "transformation", "innovation",
      "challenge", "growth", "balance", "harmony", "complexity"
    ]
    const randomThemes = themes.sort(() => 0.5 - Math.random()).slice(0, 2)
    return `This blackout poetry emphasizes the themes of ${randomThemes[0]} and ${randomThemes[1]}. 
    The poem, created from "${visibleWords.slice(0, 3).join(", ")}" and other selected words, 
    suggests a journey of ${themes[Math.floor(Math.random() * themes.length)]}, 
    highlighting key aspects of the original text while creating a new, more abstract meaning.`
  }

  const generateBlackoutPoetry = () => {
    const wordsArray = userInput.split(/\s+/).map(word => ({
      text: word,
      visible: Math.random() > 0.7 // Randomly make some words visible
    }))
    setWords(wordsArray)
    const visibleWords = wordsArray.filter(word => word.visible).map(word => word.text)
    setPoemMeaning(generateMeaning(visibleWords))
    setIsPoetryGenerated(true)
  }

  const toggleMeaning = () => {
    setIsMeaningVisible(!isMeaningVisible)
  }

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && poetryRef.current && meaningRef.current) {
        const poetryHeight = poetryRef.current.offsetHeight
        const meaningHeight = meaningRef.current.scrollHeight
        containerRef.current.style.height = `${poetryHeight + meaningHeight}px`
      }
    }

    if (isPoetryGenerated) {
      updateHeight()

      const resizeObserver = new ResizeObserver(updateHeight)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current)
        }
      }
    }
  }, [isPoetryGenerated, isMeaningVisible])

  if (!isPoetryGenerated) {
    return (
      <div className="max-w-3xl mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <Label htmlFor="user-input" className="text-lg font-semibold mb-2 block text-center">
            Share any words, preferably paragraph length...
          </Label>
          <Textarea
            id="user-input"
            value={userInput}
            onChange={handleInputChange}
            className="w-full h-40 mb-4"
            placeholder="Enter your text here..."
          />
          <Button onClick={generateBlackoutPoetry} className="w-full">
            Generate Blackout Poetry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="relative">
        {/* Ornate frame */}
        <div className="absolute inset-0 border-[40px] border-[#D4AF37] rounded-lg shadow-lg" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }} />
        
        {/* Content container */}
        <div 
          ref={containerRef}
          className="bg-[#F5F5DC] p-8 rounded-lg relative overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div ref={poetryRef}>
            <p className="text-lg leading-relaxed mb-4 font-serif">
              {words.map((word, index) => (
                <span key={index} className={word.visible ? "text-black" : "bg-black text-transparent"}>
                  {word.text}{' '}
                </span>
              ))}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={toggleMeaning}
              aria-label={isMeaningVisible ? "Hide poem meaning" : "Show poem meaning"}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <div 
            ref={meaningRef}
            className={`mt-4 p-4 bg-[#F5F5DC] rounded-lg transition-all duration-300 ease-in-out ${
              isMeaningVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
            } absolute bottom-0 left-0 right-0`}
          >
            <h2 className="text-lg font-semibold mb-2 font-serif">Poem Meaning</h2>
            <p className="text-sm font-serif">{poemMeaning}</p>
          </div>
        </div>
      </div>
    </div>
  )
}