"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber"
import { Box, OrbitControls, Sphere, Html, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { Anton } from 'next/font/google'

const anton = Anton({ weight: '400', subsets: ['latin'] })

const catGifs = [ "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif", "https://media.giphy.com/media/puYCXadOGhphDrewiv/giphy.gif", "https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy.gif", "https://media.giphy.com/media/W920wi2GVMv96/giphy.gif" ]

function GiftBoxWithRibbon() {
  const [isLidOpen, setIsLidOpen] = useState(false)
  const [catGif, setCatGif] = useState("")
  const groupRef = useRef<THREE.Group>(null!)
  const { gl } = useThree()

  useEffect(() => {
    const handleCanvasClick = () => {
      if (isLidOpen) {
        setIsLidOpen(false)
      }
    }

    gl.domElement.addEventListener('click', handleCanvasClick)

    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick)
    }
  }, [gl, isLidOpen])

  useEffect(() => {
    if (isLidOpen) {
      if (!catGif) {
        const randomIndex = Math.floor(Math.random() * catGifs.length)
        setCatGif(catGifs[randomIndex])
      }
    } else {
      setCatGif("")
    }
  }, [isLidOpen])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(time) * 0.2 + 0.5
    groupRef.current.rotation.y += 0.005
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setIsLidOpen(!isLidOpen)
  }

  const boxMaterial = (
    <meshStandardMaterial
      color="#FF0000"
      metalness={0.4}
      roughness={0.2}
      emissive="#400000"
      emissiveIntensity={0.5}
    />
  )

  const ribbonMaterial = (
    <meshStandardMaterial
      color="#FFFF00"
      metalness={0.6}
      roughness={0.3}
      emissive="#404000"
      emissiveIntensity={0.5}
    />
  )

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Box */}
      {/* Bottom */}
      <mesh
        castShadow
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        {boxMaterial}
      </mesh>
      {/* Front */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 0.5]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 0.1]} />
        {boxMaterial}
      </mesh>
      {/* Back */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, -0.5]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 0.1]} />
        {boxMaterial}
      </mesh>
      {/* Left */}
      <mesh
        castShadow
        receiveShadow
        position={[-0.5, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[0.1, 1, 1]} />
        {boxMaterial}
      </mesh>
      {/* Right */}
      <mesh
        castShadow
        receiveShadow
        position={[0.5, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[0.1, 1, 1]} />
        {boxMaterial}
      </mesh>
      {/* Top (Lid) with attached ribbon */}
      <group position={[0, 0.5, -0.5]} rotation={[isLidOpen ? -Math.PI / 2 : 0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.05, 0.5]}
        >
          <boxGeometry args={[1, 0.1, 1]} />
          {boxMaterial}
        </mesh>
        {/* Ribbon on top */}
        <Box 
          args={[0.2, 0.1, 0.2]} 
          position={[0, 0.13, 0.5]} 
          rotation={[0, 0, 0]}
          scale={1}
          castShadow
        >
          {ribbonMaterial}
        </Box>
        
        {/* Ribbon loops */}
        <Box 
          args={[0.1, 0.3, 0.05]} 
          position={[-0.1, 0.23, 0.6]} 
          rotation={[0, 0, Math.PI / 6]} 
          scale={1}
          castShadow
        >
          {ribbonMaterial}
        </Box>
        <Box 
          args={[0.1, 0.3, 0.05]} 
          position={[0.1, 0.23, 0.4]} 
          rotation={[0, 0, -Math.PI / 6]} 
          scale={1}
          castShadow
        >
          {ribbonMaterial}
        </Box>

        {/* Knot */}
        <Sphere 
          args={[0.1]} 
          position={[0, 0.18, 0.5]} 
          scale={1}
          castShadow
        >
          {ribbonMaterial}
        </Sphere>
        
        {/* Ribbon ends */}
        <Box 
          args={[0.05, 0.4, 0.02]} 
          position={[-0.1, -0.05, 0.6]} 
          rotation={[0.2, 0, 0.2]} 
          castShadow
        >
          {ribbonMaterial}
        </Box>
        <Box 
          args={[0.05, 0.4, 0.02]} 
          position={[0.1, -0.05, 0.4]} 
          rotation={[-0.2, 0, -0.2]} 
          castShadow
        >
          {ribbonMaterial}
        </Box>

        {/* Ribbon on lid (horizontal) */}
        <Box 
          args={[1.02, 0.05, 0.05]} 
          position={[0, 0.08, 0.5]}
          rotation={[0, 0, 0]}
          castShadow
        >
          {ribbonMaterial}
        </Box>
        <Box 
          args={[0.05, 0.05, 1.02]} 
          position={[0, 0.08, 0.5]}
          rotation={[0, 0, 0]}
          castShadow
        >
          {ribbonMaterial}
        </Box>
      </group>

      {/* Ribbon */}
      {/* Horizontal ribbon (front and back) */}
      <Box 
        args={[1.02, 0.1, 0.05]} 
        position={[0, -0.5, 0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      <Box 
        args={[1.02, 0.1, 0.05]} 
        position={[0, -0.5, -0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      
      {/* Horizontal ribbon (left and right) */}
      <Box 
        args={[0.05, 0.1, 1.02]} 
        position={[0.5, -0.5, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      <Box 
        args={[0.05, 0.1, 1.02]} 
        position={[-0.5, -0.5, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      
      {/* Vertical ribbon (front and back) */}
      <Box 
        args={[0.05, 1.02, 0.1]} 
        position={[0, 0, 0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      <Box 
        args={[0.05, 1.02, 0.1]} 
        position={[0, 0, -0.5]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      
      {/* Vertical ribbon (left and right) */}
      <Box 
        args={[0.1, 1.02, 0.05]} 
        position={[0.5, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      <Box 
        args={[0.1, 1.02, 0.05]} 
        position={[-0.5, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>

      {/* Ribbon on bottom (horizontal) */}
      <Box 
        args={[1.02, 0.05, 0.05]} 
        position={[0, -0.55, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>
      <Box 
        args={[0.05, 0.05, 1.02]} 
        position={[0, -0.55, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        {ribbonMaterial}
      </Box>

      {/* Cat GIF */}
      {isLidOpen && catGif && (
        <Html position={[0, 1, 0]} transform occlude>
          <div style={{ 
            width: '300px', 
            height: '300px', 
            position: 'relative',
          }}>
            <img 
              src={catGif} 
              alt="Random cat gif" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }} 
            />
          </div>
        </Html>
      )}
    </group>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={60} />
      <color attach="background" args={["#1a1a1a"]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <GiftBoxWithRibbon />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        maxDistance={10}
        minDistance={3}
        target={[0, 0.5, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <Canvas shadows>
        <Scene />
      </Canvas>
      <div className="absolute bottom-0 left-0 w-full text-center pb-4 sm:pb-[50px]">
        <h1 className={`text-2xl sm:text-4xl font-bold text-yellow-400 ${anton.className}`}>The Gif(t) Box</h1>
      </div>
    </div>
  )
}