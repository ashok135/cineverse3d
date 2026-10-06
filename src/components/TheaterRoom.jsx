import React from 'react'

/*
  TheaterRoom — Cinema auditorium environment
  - Realistic tiered concrete / carpet platforms
  - House Lights mode: Warm overhead chandeliers & wall sconces brightly illuminate the theater
  - Movie Mode: Atmospheric dim lighting with glowing step strips and wall accents
*/

export default function TheaterRoom({ isLightsOn = true }) {
  // Platform & floor colors based on lighting mode
  const carpetColor = isLightsOn ? '#1a1e28' : '#0e1118'
  const platformColor = isLightsOn ? '#222736' : '#141822'

  return (
    <group>
      {/* ═══════ MAIN FLOOR CARPET ═══════ */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[42, 52]} />
        <meshStandardMaterial color={carpetColor} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ═══════ FRONT SECTION PLATFORM (Rows A-C) ═══════ */}
      <mesh position={[0, 0.02, -9]}>
        <boxGeometry args={[18, 0.04, 5.5]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════ MIDDLE SECTION TIERED PLATFORMS (Rows D-G) ═══════ */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`mid-${i}`} position={[0, 0.15 + i * 0.25, -4 + i * 1.6]}>
          <boxGeometry args={[18, 0.15 + i * 0.25, 1.55]} />
          <meshStandardMaterial color={platformColor} roughness={0.85} />
        </mesh>
      ))}

      {/* ═══════ BALCONY SECTION TIERED PLATFORMS (Rows H-J) ═══════ */}
      {[0, 1, 2].map((i) => (
        <mesh key={`bal-${i}`} position={[0, 1.4 + i * 0.35, 3.5 + i * 1.6]}>
          <boxGeometry args={[18, 1.4 + i * 0.35, 1.55]} />
          <meshStandardMaterial color={platformColor} roughness={0.85} />
        </mesh>
      ))}

      {/* ═══════ STEP EDGE GLOW STRIPS ═══════ */}
      {[
        { z: -5.2, y: 0.16 },
        { z: -3.6, y: 0.41 },
        { z: -2.0, y: 0.66 },
        { z: -0.4, y: 0.91 },
        { z: 2.8, y: 1.41 },
        { z: 4.4, y: 1.76 },
        { z: 6.0, y: 2.11 },
      ].map((step, i) => (
        <mesh key={`step-${i}`} position={[0, step.y, step.z]}>
          <boxGeometry args={[16.5, 0.025, 0.04]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={isLightsOn ? 1.4 : 2.2}
          />
        </mesh>
      ))}

      {/* ═══════ AISLE LIGHT STRIPS (Left, Right, Center) ═══════ */}
      {/* Left aisle */}
      <mesh position={[-7.8, 0.03, -2]}>
        <boxGeometry args={[0.06, 0.02, 22]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.0} />
      </mesh>
      <pointLight
        position={[-7.8, 0.3, -2]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Right aisle */}
      <mesh position={[7.8, 0.03, -2]}>
        <boxGeometry args={[0.06, 0.02, 22]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2.0} />
      </mesh>
      <pointLight
        position={[7.8, 0.3, -2]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Center walkway divider */}
      <mesh position={[0, 0.02, -2]}>
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
          <pointLight position={[0, 8.5, -7]} intensity={25} distance={16} color="#fef3c7" />
          <pointLight position={[0, 8.5, -1]} intensity={28} distance={18} color="#fef3c7" />
          <pointLight position={[0, 9.5, 5]} intensity={30} distance={20} color="#fef3c7" />
          <pointLight position={[-4, 8, 0]} intensity={18} distance={14} color="#fde68a" />
          <pointLight position={[4, 8, 0]} intensity={18} distance={14} color="#fde68a" />
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
