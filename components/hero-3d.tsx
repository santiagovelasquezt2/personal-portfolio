'use client'

import React, { useEffect } from "react"

import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Environment, Center } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { Mesh } from 'three'
import * as THREE from 'three'

// Shared state for mouse position (global so it works even outside 3D elements)
const mouseState = {
  x: 0,
  y: 0,
  initialized: false
}

function MetallicText({
  text,
  position
}: {
  text: string
  position: [number, number, number]
}) {
  const meshRef = useRef<Mesh>(null)

  return (
    <Text3D
      ref={meshRef}
      font="/fonts/Geist_Bold.json"
      size={12}
      height={1.2}
      curveSegments={16}
      bevelEnabled
      bevelThickness={0.18}
      bevelSize={0.12}
      bevelOffset={0}
      bevelSegments={12}
      position={position}
    >
      {text}
      <meshPhysicalMaterial
        color="#3a3a3a"
        metalness={0.98}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.05}
        reflectivity={1}
        envMapIntensity={1.5}
      />
    </Text3D>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 })

  // Global mouse listener for movement (works even on empty canvas areas)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseState.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseState.y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseState.initialized = true
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smoothly interpolate rotation
  useFrame(() => {
    // Update target rotation from global mouse state
    if (mouseState.initialized) {
      setTargetRotation({ x: mouseState.y, y: mouseState.x })
    }

    // Smooth rotation interpolation - letters move OPPOSITE to mouse
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -targetRotation.x * 0.2,
        0.08
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        -targetRotation.y * 0.2,
        0.08
      )
    }
  })

  return (
    <Center>
      <group ref={groupRef}>
        <MetallicText text="S" position={[-12, 0, 0]} />
        <MetallicText text="V" position={[-2, 0, 0]} />
        <MetallicText text="T" position={[9.7, 0, 0]} />
      </group>
    </Center>
  )
}

export function Hero3D() {
  return (
    <div className="w-full h-screen relative bg-white">
      <Canvas
        camera={{ position: [0, 0, 38], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 8]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />

        <Scene />

        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
