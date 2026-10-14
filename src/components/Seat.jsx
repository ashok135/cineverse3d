import React, { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/*
  Seat Component — Premium Cinema Recliner
  ─────────────────────────────────────────
  Realistic cinema recliner with:
  • Curved padded backrest with headrest wings
  • Thick contoured seat cushion
  • Padded armrests with cup holders
  • Under-seat ambient LED strip
  • Luxurious leather/velvet material look

  Color States:
  - Available: Deep Ruby Red (classic cinema)
  - Booked / Sold: Charcoal Grey
  - Selected: Bright Amber / Gold
  - Confirmed: Radiant Emerald Green
  - Hover: Cool Sky Blue
*/

// Create a rounded box shape for cushion-like geometry
function RoundedBox({ width, height, depth, radius = 0.04, segments = 4, ...meshProps }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const w = width / 2 - radius
    const h = height / 2 - radius

    shape.moveTo(-w, -h - radius)
    shape.lineTo(w, -h - radius)
    shape.quadraticCurveTo(w + radius, -h - radius, w + radius, -h)
    shape.lineTo(w + radius, h)
    shape.quadraticCurveTo(w + radius, h + radius, w, h + radius)
    shape.lineTo(-w, h + radius)
    shape.quadraticCurveTo(-w - radius, h + radius, -w - radius, h)
    shape.lineTo(-w - radius, -h)
    shape.quadraticCurveTo(-w - radius, -h - radius, -w, -h - radius)

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: radius * 0.5,
      bevelSize: radius * 0.5,
      bevelSegments: segments,
    }
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.center()
    return geo
  }, [width, height, depth, radius, segments])

  return <mesh geometry={geometry} {...meshProps} />
}

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

  // ─── Color Palette ───
  let cushionColor = '#b91c1c'     // Deep ruby red — classic cinema
  let shellColor = '#1c1917'       // Rich dark brown-black shell
  let stitchColor = '#991b1b'      // Darker accent for stitching details
  let emissiveColor = '#7f1d1d'
  let emissiveIntensity = 0.06
  let ledColor = '#f59e0b'
  let ledIntensity = 0.0

  if (isOccupied) {
    cushionColor = '#44403c'
    shellColor = '#1c1917'
    stitchColor = '#292524'
    emissiveColor = '#000000'
    emissiveIntensity = 0
    ledIntensity = 0
  } else if (isConfirmed) {
    cushionColor = '#059669'
    shellColor = '#064e3b'
    stitchColor = '#047857'
    emissiveColor = '#10b981'
    emissiveIntensity = 0.55
    ledColor = '#10b981'
    ledIntensity = 2.5
  } else if (isSelected) {
    cushionColor = '#d97706'
    shellColor = '#78350f'
    stitchColor = '#b45309'
    emissiveColor = '#f59e0b'
    emissiveIntensity = 0.7
    ledColor = '#f59e0b'
    ledIntensity = 3.0
  } else if (hovered) {
    cushionColor = '#0284c7'
    shellColor = '#0c4a6e'
    stitchColor = '#0369a1'
    emissiveColor = '#38bdf8'
    emissiveIntensity = 0.4
    ledColor = '#38bdf8'
    ledIntensity = 2.0
  } else if (!isLightsOn) {
    // Movie mode — subtle warm underglow
    emissiveIntensity = 0.04
    ledColor = '#f59e0b'
    ledIntensity = 0.6
  } else {
    // Normal house lights
    ledIntensity = 0.4
  }

  const cushionMat = {
    color: cushionColor,
    roughness: 0.72,
    metalness: 0.05,
    emissive: emissiveColor,
    emissiveIntensity,
  }

  const shellMat = {
    color: shellColor,
    roughness: 0.5,
    metalness: 0.35,
  }

  const metalMat = {
    color: '#292524',
    roughness: 0.3,
    metalness: 0.85,
  }

  return (
    <group
      ref={groupRef}
      position={position}
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
      {/* ─── HEAVY METAL BASE ─── */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.48, 0.04, 0.52]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Center pedestal — tapered cylinder */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.09, 0.14, 16]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Hydraulic lift arm */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.07, 0.06, 0.06, 16]} />
        <meshStandardMaterial color="#1c1917" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* ─── SEAT PAN (structural frame under cushion) ─── */}
      <mesh position={[0, 0.24, 0.02]}>
        <boxGeometry args={[0.56, 0.04, 0.52]} />
        <meshStandardMaterial {...shellMat} />
      </mesh>

      {/* ─── SEAT CUSHION (thick, contoured) ─── */}
      <RoundedBox
        width={0.52}
        height={0.48}
        depth={0.1}
        radius={0.04}
        position={[0, 0.33, 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial {...cushionMat} />
      </RoundedBox>

      {/* Cushion stitching detail line (center) */}
      <mesh position={[0, 0.345, 0.02]}>
        <boxGeometry args={[0.01, 0.01, 0.42]} />
        <meshStandardMaterial color={stitchColor} roughness={0.9} />
      </mesh>

      {/* ─── BACKREST (curved, padded) ─── */}
      {/* Main back shell */}
      <mesh position={[0, 0.62, 0.29]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.56, 0.56, 0.06]} />
        <meshStandardMaterial {...shellMat} />
      </mesh>

      {/* Backrest cushion (front-facing, padded) */}
      <RoundedBox
        width={0.50}
        height={0.50}
        depth={0.08}
        radius={0.04}
        position={[0, 0.62, 0.23]}
        rotation={[0.12, 0, 0]}
      >
        <meshStandardMaterial {...cushionMat} />
      </RoundedBox>

      {/* Backrest stitching (vertical center line) */}
      <mesh position={[0, 0.62, 0.19]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.01, 0.44, 0.01]} />
        <meshStandardMaterial color={stitchColor} roughness={0.9} />
      </mesh>

      {/* ─── HEADREST WINGS ─── */}
      {/* Left wing */}
      <mesh position={[-0.22, 0.88, 0.30]} rotation={[0.12, 0.2, 0]}>
        <boxGeometry args={[0.14, 0.16, 0.08]} />
        <meshStandardMaterial {...cushionMat} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.22, 0.88, 0.30]} rotation={[0.12, -0.2, 0]}>
        <boxGeometry args={[0.14, 0.16, 0.08]} />
        <meshStandardMaterial {...cushionMat} />
      </mesh>
      {/* Center headrest pad */}
      <RoundedBox
        width={0.30}
        height={0.14}
        depth={0.06}
        radius={0.03}
        position={[0, 0.89, 0.25]}
        rotation={[0.12, 0, 0]}
      >
        <meshStandardMaterial {...cushionMat} />
      </RoundedBox>

      {/* ─── LEFT ARMREST ─── */}
      {/* Armrest structural frame */}
      <mesh position={[-0.32, 0.36, 0.06]}>
        <boxGeometry args={[0.06, 0.22, 0.46]} />
        <meshStandardMaterial {...shellMat} />
      </mesh>
      {/* Armrest top pad */}
      <RoundedBox
        width={0.10}
        height={0.40}
        depth={0.04}
        radius={0.02}
        position={[-0.32, 0.49, 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#3f3f46" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      {/* Cup holder — outer ring */}
      <mesh position={[-0.32, 0.50, -0.12]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.055, 0.012, 8, 16]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>
      {/* Cup holder — inner depression */}
      <mesh position={[-0.32, 0.485, -0.12]}>
        <cylinderGeometry args={[0.045, 0.045, 0.025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* ─── RIGHT ARMREST ─── */}
      <mesh position={[0.32, 0.36, 0.06]}>
        <boxGeometry args={[0.06, 0.22, 0.46]} />
        <meshStandardMaterial {...shellMat} />
      </mesh>
      <RoundedBox
        width={0.10}
        height={0.40}
        depth={0.04}
        radius={0.02}
        position={[0.32, 0.49, 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#3f3f46" roughness={0.5} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0.32, 0.50, -0.12]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.055, 0.012, 8, 16]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>
      <mesh position={[0.32, 0.485, -0.12]}>
        <cylinderGeometry args={[0.045, 0.045, 0.025, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* ─── UNDER-SEAT LED STRIP ─── */}
      <mesh position={[0, 0.06, -0.18]}>
        <boxGeometry args={[0.42, 0.015, 0.04]} />
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={ledIntensity}
        />
      </mesh>
      {/* Side LED strips */}
      <mesh position={[-0.26, 0.06, 0.04]}>
        <boxGeometry args={[0.015, 0.015, 0.40]} />
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={ledIntensity * 0.6}
        />
      </mesh>
      <mesh position={[0.26, 0.06, 0.04]}>
        <boxGeometry args={[0.015, 0.015, 0.40]} />
        <meshStandardMaterial
          color={ledColor}
          emissive={ledColor}
          emissiveIntensity={ledIntensity * 0.6}
        />
      </mesh>

      {/* ─── SELECTION / CONFIRMATION GLOW ─── */}
      {(isSelected || isConfirmed) && (
        <pointLight
          position={[0, 0.15, 0]}
          intensity={3.5}
          distance={1.8}
          color={isConfirmed ? '#10b981' : '#f59e0b'}
        />
      )}
    </group>
  )
}
