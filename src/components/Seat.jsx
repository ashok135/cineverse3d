import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

/*
  Seat Component:
  - Available: Light Green (#22c55e / #16a34a)
  - Booked / Sold: Full Grey (#64748b / #334155)
  - Selected: Bright Amber / Gold (#f59e0b)
  - Confirmed: Radiant Emerald Green (#10b981)
  - Hover: Cool Sky Blue (#38bdf8)
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

  // Seat Colors based on User Specification:
  // Available: Light Green
  // Booked / Sold: Full Grey
  let cushionColor = '#22c55e'  // Vibrant Light Green for available seats
  let shellColor = '#15803d'    // Darker forest green shell
  let emissiveColor = '#16a34a'
  let emissiveIntensity = 0.12

  if (isOccupied) {
    // Booked / Sold: Full Grey
    cushionColor = '#64748b'    // Solid medium slate grey
    shellColor = '#334155'      // Darker grey shell
    emissiveColor = '#000000'
    emissiveIntensity = 0
  } else if (isConfirmed) {
    // Confirmed: Bright Emerald Green
    cushionColor = '#10b981'
    shellColor = '#065f46'
    emissiveColor = '#059669'
    emissiveIntensity = 0.65
  } else if (isSelected) {
    // Selected: Radiant Amber / Gold
    cushionColor = '#f59e0b'
    shellColor = '#b45309'
    emissiveColor = '#d97706'
    emissiveIntensity = 0.85
  } else if (hovered) {
    // Hover: Cool Sky Blue
    cushionColor = '#38bdf8'
    shellColor = '#0369a1'
    emissiveColor = '#0284c7'
    emissiveIntensity = 0.5
  } else if (!isLightsOn) {
    // In movie mode, subtle green velvet glow so it remains visible
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
          roughness={0.55}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Backrest Inner Cushion */}
      <mesh position={[0, 0.62, 0.22]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.54, 0.58, 0.1]} />
        <meshStandardMaterial
          color={cushionColor}
          roughness={0.55}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Backrest Outer Protective Shell */}
      <mesh position={[0, 0.62, 0.28]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.58, 0.62, 0.04]} />
        <meshStandardMaterial color={shellColor} roughness={0.5} metalness={0.25} />
      </mesh>

      {/* Left Armrest */}
      <mesh position={[-0.31, 0.42, 0.05]}>
        <boxGeometry args={[0.07, 0.18, 0.44]} />
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Left Armrest Top Pad */}
      <mesh position={[-0.31, 0.52, 0.05]}>
        <boxGeometry args={[0.09, 0.03, 0.42]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Right Armrest */}
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
