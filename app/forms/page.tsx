"use client"

import { useState, useEffect, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle } from "lucide-react"
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"

export default function Component() {
  const [openDrawer, setOpenDrawer] = useState<{ cabinetIndex: number | null, drawerIndex: number | null }>({ cabinetIndex: null, drawerIndex: null })
  const [formCabinetIndex, setFormCabinetIndex] = useState<number>(0)
  const [showYouMadeIt, setShowYouMadeIt] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  
  const [userAnswers, setUserAnswers] = useState({
    email: "",
    password: ""
  })

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 60%)`
  }

  const cabinetColors = useMemo(() => {
    return Array(12).fill(0).map(() => generateRandomColor())
  }, [])

  useEffect(() => {
    setFormCabinetIndex(Math.floor(Math.random() * 12))
  }, [])

  const toggleDrawer = (cabinetIndex: number, drawerIndex: number) => {
    setOpenDrawer(prev => {
      if (prev.cabinetIndex === cabinetIndex && prev.drawerIndex === drawerIndex) {
        return { cabinetIndex: null, drawerIndex: null }
      } else {
        return { cabinetIndex, drawerIndex }
      }
    })

    if (cabinetIndex === formCabinetIndex) {
      setShowYouMadeIt(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [field]: value }))
  }


  const handleYouMadeIt = () => {
    setGameWon(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const cabinetDrawers = [
    { label: 'Drawer 1', icon: FileText },
    { label: 'Drawer 2', icon: FileText },
  ]

  const renderDrawerContent = (cabinetIndex: number, drawerIndex: number) => {
    if (cabinetIndex === formCabinetIndex) {
      switch (drawerIndex) {
        case 0:
          return (
            <div className="space-y-2">
              <Label htmlFor="small-email">Email</Label>
              <Input 
                id="small-email" 
                type="email" 
                value={userAnswers.email} 
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          )
        case 1:
          return (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={userAnswers.password} 
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
          )
        default:
          return null
      }
    }
    return <div className="text-4xl text-center">🤪</div>
  }

  const renderCabinet = (cabinetIndex: number) => (
    <div className="rounded-lg shadow-xl overflow-visible relative w-full h-full min-h-[200px]" style={{ backgroundColor: cabinetColors[cabinetIndex] }}>
      {/* Cabinet texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%222%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E')]"></div>
      
      {/* Cabinet top */}
      <div className="h-4 border-b border-black/20 relative z-10"></div>
      
      {/* Drawers */}
      {cabinetDrawers.map((drawer, index) => (
        <div key={index} className="border-b border-black/20 last:border-b-0 relative">
          <div className="relative">
            <button
              onClick={() => toggleDrawer(cabinetIndex, index)}
              className={`w-full p-4 flex justify-between items-center text-left transition-colors hover:brightness-110 relative z-20`}
              style={{ backgroundColor: `${cabinetColors[cabinetIndex]}` }}
              aria-expanded={openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index}
              aria-controls={`drawer-content-${cabinetIndex}-${index}`}
            >
              <span className="text-white">
                <drawer.icon className="w-6 h-6" aria-label={drawer.label} />
              </span>
              <div className="w-8 h-1 bg-white/70 rounded-full"></div>
            </button>
            <div 
              id={`drawer-content-${cabinetIndex}-${index}`}
              className={`absolute left-0 w-full bg-amber-50 overflow-hidden transition-all duration-300 ease-out ${
                openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index ? 'shadow-lg' : ''
              }`}
              style={{
                maxHeight: openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index ? '1000px' : '0',
                top: '100%',
                opacity: openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index ? 1 : 0,
                zIndex: 30,
              }}
            >
              <div className="p-4">
                {renderDrawerContent(cabinetIndex, index)}
              </div>
            </div>
          </div>
          {/* Drawer shadow */}
          <div 
            className="absolute left-0 w-full h-2 bg-gradient-to-b from-black/20 to-transparent transition-all duration-300 ease-out"
            style={{
              top: '100%',
              transform: `translateY(${openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index ? '0' : '-100%'})`,
              opacity: openDrawer.cabinetIndex === cabinetIndex && openDrawer.drawerIndex === index ? 1 : 0,
              zIndex: 25,
            }}
          ></div>
        </div>
      ))}
      
      {/* Cabinet bottom */}
      <div className="h-4 border-t border-black/20 relative z-10"></div>

      {/* Submit button */}
      {cabinetIndex === formCabinetIndex && showYouMadeIt && (
        <div className="absolute bottom-2 right-2 z-40">
          <Button onClick={handleYouMadeIt} size="icon" className="rounded-full w-10 h-10">
            <CheckCircle className="h-6 w-6" />
            <span className="sr-only">Submit</span>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barriecito&display=swap');
      `}</style>
      <div className="min-h-screen bg-gray-900 p-4 flex flex-col">
        <h1 className="text-4xl md:text-6xl text-center mb-8 font-['Barriecito'] text-white">
          SIGN UP...EVENTUALLY
        </h1>
        <div className="flex-1 flex flex-wrap justify-center items-stretch gap-4 overflow-auto">
          {gameWon ? (
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-6xl text-white font-['Barriecito']">Congratulations!</h2>
            </div>
          ) : (
            [...Array(12)].map((_, index) => (
              <div key={index} className="flex-1 min-w-[250px] max-w-[300px]">
                {renderCabinet(index)}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}