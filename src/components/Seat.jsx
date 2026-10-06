import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

/*
  Seat Component:
  - Rich cinema plush fabric with visible highlights and specular reflections
  - Clear contrast against floor so seats are distinctly visible even in dim lighting
  - Distinct colors for Balcony (royal ruby), Prime (deep crimson), and Classic (cinema red)
  - Interactive states: Available, Sold (grey), Selected (gold), Confirmed (emerald)
*/

export default function Seat({
  id,
  row,
  number,
  position,
  isOccupied,
  isSelected,
  isConfirmed,
  isLightsOn = true,
  onSelect,
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const baseY = position[1]

  // GSAP lift on selection
  useEffect(() => {
    if (!groupRef.current) return
    gsap.to(groupRef.current.position, {
      y: isSelected ? baseY + 0.28 : baseY,
      duration: 0.45,
      ease: 'back.out(1.4)',
    })
  }, [isSelected, baseY])

  // Cursor pointer
  useEffect(() => {
    if (isOccupied) return
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, isOccupied])

  // Tier-based default fabric color (Visible classic cinema seats!)
  const getTierColor = () => {
    if (row === 'J' || row === 'I' || row === 'H') {
      // Royal Balcony: Deep Wine / Ruby Velvet
      return { cushion: '#9f1239', shell: '#4c0519' }
    }
    if (row === 'G' || row === 'F' || row === 'E' || row === 'D') {
      // Prime Recliners: Classic Cinema Crimson
      return { cushion: '#b91c1c', shell: '#7f1d1d' }
    }
    // Front: Vibrant Cinema Red
    return { cushion: '#dc2626', shell: '#991b1b' }
  }

  const tierColors = getTierColor()
  let cushionColor = tierColors.cushion
  let shellColor = tierColors.shell
  let emissiveColor = '#000000'
  let emissiveIntensity = 0

  if (isOccupied) {
    // Sold seat: Slate grey, clearly occupied
    cushionColor = '#475569'
    shellColor = '#334155'
  } else if (isConfirmed) {
    // Confirmed: Bright Emerald Green
    cushionColor = '#10b981'
    shellColor = '#065f46'
    emissiveColor = '#059669'
    emissiveIntensity = 0.6
  } else if (isSelected) {
    // Selected: Radiant Amber / Gold
    cushionColor = '#f59e0b'
    shellColor = '#b45309'
    emissiveColor = '#d97706'
    emissiveIntensity = 0.8
  } else if (hovered) {
    // Hover: Bright Sky Blue
    cushionColor = '#38bdf8'
    shellColor = '#0369a1'
    emissiveColor = '#0284c7'
    emissiveIntensity = 0.45
  } else if (!isLightsOn) {
    // In movie mode, give a very subtle velvet sheen so it never turns pitch-black
    emissiveColor = cushionColor
    emissiveIntensity = 0.08
  }

  return (
    <group
      ref={groupRef}
      position={position}
      // Facing -Z (toward the screen)
      onClick={(e) => {
        e.stopPropagation()
        if (isOccupied) return
        onSelect({ id, row, number, position })
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!isOccupied) setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Heavy Base Plate */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Center Metal Pedestal */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.18, 12]} />
        <meshStandardMaterial color="#27272a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Seat Cushion (User sits on this) */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.54, 0.12, 0.5]} />
        <meshStandardMaterial
          color={cushionColor}
          roughness={0.65}
          metalness={0.15}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Backrest Inner Cushion */}
      <mesh position={[0, 0.62, 0.22]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.54, 0.58, 0.1]} />
        <meshStandardMaterial
          color={cushionColor}
          roughness={0.65}
          metalness={0.15}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Backrest Outer Protective Shell */}
      <mesh position={[0, 0.62, 0.28]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.58, 0.62, 0.04]} />
        <meshStandardMaterial color={shellColor} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Left Armrest with Cup Holder */}
      <mesh position={[-0.31, 0.42, 0.05]}>
        <boxGeometry args={[0.07, 0.18, 0.44]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Left Armrest Top Pad */}
      <mesh position={[-0.31, 0.52, 0.05]}>
        <boxGeometry args={[0.09, 0.03, 0.42]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Right Armrest with Cup Holder */}
      <mesh position={[0.31, 0.42, 0.05]}>
        <boxGeometry args={[0.07, 0.18, 0.44]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Right Armrest Top Pad */}
      <mesh position={[0.31, 0.52, 0.05]}>
        <boxGeometry args={[0.09, 0.03, 0.42]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Under-glow / Spotlight when selected or confirmed */}
      {(isSelected || isConfirmed) && (
        <pointLight
          position={[0, 0.2, 0]}
          intensity={3.2}
          distance={1.6}
          color={isConfirmed ? '#10b981' : '#f59e0b'}
        />
      )}
    </group>
  )
}
