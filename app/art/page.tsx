"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas'

export default function DolphinPaint() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDrawing(true)
    setPosition({ x: clientX, y: clientY })
  }, [])

  const handleEnd = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(position.x, position.y)
        ctx.lineTo(clientX, clientY)
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)'  // Semi-transparent gray
        ctx.lineWidth = 20  // 20% of the original 100 (decreased by 80%)
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      setPosition({ x: clientX, y: clientY })
    }
  }, [isDrawing, position])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    if (isDrawing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDrawing, handleMove, handleEnd])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Set initial position to the center of the screen
      setPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }
  }, [])

  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, [])

  const captureScreenshot = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      if (containerRef.current) {
        const saveButton = containerRef.current.querySelector('#save-art-button') as HTMLElement
        const dolphinElement = containerRef.current.querySelector('#dolphin-brush') as HTMLElement
        if (saveButton) {
          saveButton.style.display = 'none'
        }
        if (dolphinElement) {
          const rect = dolphinElement.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          // Adjust position if dolphin is outside viewport
          if (rect.right > viewportWidth) {
            dolphinElement.style.transform = `translate(${viewportWidth - rect.width - 20}px, ${position.y - 100}px)`
          }
          if (rect.bottom > viewportHeight) {
            dolphinElement.style.transform = `translate(${position.x - 100}px, ${viewportHeight - rect.height - 20}px)`
          }
        }

        setTimeout(() => {
          html2canvas(containerRef.current!, {
            allowTaint: true,
            useCORS: true,
            logging: true,
            width: window.innerWidth,
            height: window.innerHeight,
            x: 0,
            y: 0,
          }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png')
            resolve(dataUrl)
            // Reset dolphin position
            if (dolphinElement) {
              dolphinElement.style.transform = `translate(${position.x - 100}px, ${position.y - 100}px)`
            }
          }).catch(error => {
            console.error('Error capturing screenshot:', error)
            reject(error)
          }).finally(() => {
            if (saveButton) {
              saveButton.style.display = 'block'
            }
          })
        }, 100)
      } else {
        reject(new Error('Container ref is null'))
      }
    })
  }, [position])

  const handleSaveArt = useCallback(() => {
    captureScreenshot().then(dataUrl => {
      if (isMobile()) {
        // For mobile: show confirmation modal
        setScreenshotUrl(dataUrl)
        setShowModal(true)
      } else {
        // For desktop: download directly
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'dolphin-art.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }).catch(error => {
      console.error('Error in handleSaveArt:', error)
    })
  }, [captureScreenshot, isMobile])

  const handleConfirmSave = useCallback(() => {
    if (screenshotUrl) {
      if (isMobile()) {
        // For mobile: open in new tab
        const newTab = window.open()
        if (newTab) {
          newTab.document.write(`<img src="${screenshotUrl}" alt="Dolphin Art"/>`)
          newTab.document.title = 'Dolphin Art'
          newTab.document.close()
        } else {
          console.error('Failed to open new tab')
        }
      } else {
        // For desktop: download directly
        const link = document.createElement('a')
        link.href = screenshotUrl
        link.download = 'dolphin-art.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      console.error('Screenshot URL is null')
    }
    setShowModal(false)
  }, [screenshotUrl, isMobile])

  const handleCancelSave = useCallback(() => {
    setShowModal(false)
    setScreenshotUrl(null)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden touch-none bg-parchment">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sixtyfour&display=swap');

        :root {
          --sat: env(safe-area-inset-top);
          --sar: env(safe-area-inset-right);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        .artiste-text {
          font-family: 'Sixtyfour', cursive;
        }

        @keyframes rainbow {
          0% { color: red; }
          14% { color: orange; }
          28% { color: yellow; }
          42% { color: green; }
          57% { color: blue; }
          71% { color: indigo; }
          85% { color: violet; }
          100% { color: red; }
        }

        .rainbow-text {
          animation: rainbow 8s linear infinite;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }

        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .modal-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .confirm-button {
          background-color: #4CAF50;
          color: white;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        .safe-area-bottom {
          padding-bottom: max(1rem, var(--sab));
        }
      `}</style>
      <button
        id="save-art-button"
        onClick={handleSaveArt}
        className="absolute top-4 right-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded z-20"
      >
        SAVE ART
      </button>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      <div
        id="dolphin-brush"
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="cursor-none absolute touch-none z-10 select-none"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x - 100}px, ${position.y - 100}px)`,
          transition: isDrawing ? 'none' : 'transform 0.1s ease-out',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
        tabIndex={-1}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94grey%20dolphin%20flat%20design_6504885-LRMDl7vgYs1jPpciHrE5oNJCNtJGEE.png"
          alt="Dolphin brush"
          width={200}
          height={200}
          className="pointer-events-none"
          draggable={false}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center z-20 safe-area-bottom">
        <h2 className="artiste-text text-4xl rainbow-text">I AM ARTISTE</h2>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>YOU ARE ARTISTE</h3>
            <p>You should save your dolphin art:</p>
            <div className="modal-buttons">
              <button className="modal-button confirm-button" onClick={handleConfirmSave}>OMG yes</button>
              <button className="modal-button cancel-button" onClick={handleCancelSave}>OMG but wait</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}