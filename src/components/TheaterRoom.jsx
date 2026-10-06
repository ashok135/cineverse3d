import React from 'react'
import { SEAT_ROWS } from '../data/cinemaData'

/*
  TheaterRoom — Cinema auditorium environment
  - Dynamically aligns platform tier surfaces to exact seat Y heights
  - Eliminates seat clipping: seats rest perfectly on top of platform steps
  - Balcony (Rows H, I, J) fully elevated and visible
  - Step edge glow strips, aisle lighting, and auditorium walls
*/

export default function TheaterRoom({ isLightsOn = true }) {
  // Platform & floor colors based on lighting mode
  const carpetColor = isLightsOn ? '#1a1e28' : '#0e1118'
  const platformColor = isLightsOn ? '#222736' : '#141822'

  return (
    <group>
      {/* ═══════ MAIN FLOOR CARPET ═══════ */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 54]} />
        <meshStandardMaterial color={carpetColor} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ═══════ FRONT SECTION BASE PLATFORM (Rows A-C) ═══════ */}
      <mesh position={[0, 0.02, -8.4]}>
        <boxGeometry args={[17.8, 0.04, 5.0]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════ DYNAMIC TIERED PLATFORMS (Rows D through J) ═══════ */}
      {SEAT_ROWS.filter((r) => r.y > 0.04).map((r) => {
        // Platform top surface is at r.y, so center is r.y / 2 with height r.y
        const height = r.y
        const centerY = r.y / 2
        const depth = 1.58

        return (
          <React.Fragment key={`platform-${r.name}`}>
            {/* Solid platform block */}
            <mesh position={[0, centerY, r.z]}>
              <boxGeometry args={[17.8, height, depth]} />
              <meshStandardMaterial color={platformColor} roughness={0.85} />
            </mesh>

            {/* Step edge glow strip at front of the step */}
            <mesh position={[0, r.y + 0.015, r.z - depth / 2]}>
              <boxGeometry args={[16.6, 0.025, 0.04]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={isLightsOn ? 1.5 : 2.5}
              />
            </mesh>
          </React.Fragment>
        )
      })}

      {/* ═══════ CROSS-AISLE WALKWAY (Between Middle & Balcony) ═══════ */}
      <mesh position={[0, 1.35 / 2, 1.8]}>
        <boxGeometry args={[17.8, 1.35, 0.8]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════ SIDE AISLE LIGHT STRIPS (Left & Right) ═══════ */}
      {/* Left aisle */}
      <mesh position={[-7.8, 0.04, -2]}>
        <boxGeometry args={[0.06, 0.02, 22]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.0} />
      </mesh>
      <pointLight
        position={[-7.8, 0.4, -2]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Right aisle */}
      <mesh position={[7.8, 0.04, -2]}>
        <boxGeometry args={[0.06, 0.02, 22]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.0} />
      </mesh>
      <pointLight
        position={[7.8, 0.4, -2]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Center aisle walkway divider */}
      <mesh position={[0, 0.03, -2]}>
        <boxGeometry args={[0.08, 0.02, 22]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={isLightsOn ? 0.4 : 0.8}
        />
      </mesh>

      {/* ═══════ AUDITORIUM WALLS ═══════ */}
      {/* Left wall */}
      <mesh position={[-12, 5, -3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[32, 14]} />
        <meshStandardMaterial color={isLightsOn ? '#1a1d26' : '#0a0d14'} roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[12, 5, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[32, 14]} />
        <meshStandardMaterial color={isLightsOn ? '#1a1d26' : '#0a0d14'} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 5, 12.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[26, 14]} />
        <meshStandardMaterial color={isLightsOn ? '#171922' : '#080a10'} roughness={0.9} />
      </mesh>

      {/* ═══════ WALL SCONCE ACCENTS ═══════ */}
      {[-10, -4, 2, 8].map((z) => (
        <React.Fragment key={`sconce-${z}`}>
          {/* Left sconce */}
          <mesh position={[-11.8, 4.2, z]}>
            <boxGeometry args={[0.1, 0.8, 0.08]} />
            <meshStandardMaterial
              color={isLightsOn ? '#f59e0b' : '#38bdf8'}
              emissive={isLightsOn ? '#f59e0b' : '#38bdf8'}
              emissiveIntensity={isLightsOn ? 2.5 : 3.5}
            />
          </mesh>
          <pointLight
            position={[-11.4, 4.2, z]}
            intensity={isLightsOn ? 8 : 4}
            distance={7}
            color={isLightsOn ? '#fbbf24' : '#60a5fa'}
          />

          {/* Right sconce */}
          <mesh position={[11.8, 4.2, z]}>
            <boxGeometry args={[0.1, 0.8, 0.08]} />
            <meshStandardMaterial
              color={isLightsOn ? '#f59e0b' : '#38bdf8'}
              emissive={isLightsOn ? '#f59e0b' : '#38bdf8'}
              emissiveIntensity={isLightsOn ? 2.5 : 3.5}
            />
          </mesh>
          <pointLight
            position={[11.4, 4.2, z]}
            intensity={isLightsOn ? 8 : 4}
            distance={7}
            color={isLightsOn ? '#fbbf24' : '#60a5fa'}
          />
        </React.Fragment>
      ))}

      {/* ═══════ HOUSE LIGHTS DOWNLIGHTS (Active when Lights ON) ═══════ */}
      {isLightsOn && (
        <>
          <pointLight position={[0, 9.5, -7]} intensity={25} distance={16} color="#fef3c7" />
          <pointLight position={[0, 9.5, -1]} intensity={28} distance={18} color="#fef3c7" />
          <pointLight position={[0, 10.5, 5]} intensity={32} distance={20} color="#fef3c7" />
          <pointLight position={[-4, 9, 0]} intensity={18} distance={14} color="#fde68a" />
          <pointLight position={[4, 9, 0]} intensity={18} distance={14} color="#fde68a" />
        </>
      )}

      {/* ═══════ EXIT SIGNS ═══════ */}
      <mesh position={[-11.6, 7.5, 10]}>
        <boxGeometry args={[1.5, 0.45, 0.05]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={3} />
      </mesh>
      <mesh position={[11.6, 7.5, 10]}>
        <boxGeometry args={[1.5, 0.45, 0.05]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}
