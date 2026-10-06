import React from 'react'
import { SEAT_ROWS } from '../data/cinemaData'

/*
  TheaterRoom — Inward-Facing Non-Blocking Cinema Auditorium
  - Single-sided inward-facing walls:
    * From INSIDE: Rich 3D acoustic panels, LED cove lights, Dolby Atmos speakers, exit doors
    * From OUTSIDE: 100% INVISIBLE (Backface culled) — walls NEVER block your camera view!
  - Pushed comfortably wide (x = ±13.5, z = 13.0) so camera is always cleanly inside
  - Tiered platform risers aligned with seats for zero clipping
*/

export default function TheaterRoom({ isLightsOn = true }) {
  // Auditorium color palette
  const carpetColor = isLightsOn ? '#1a1e28' : '#0e1118'
  const platformColor = isLightsOn ? '#222736' : '#141822'
  const wallBaseColor = isLightsOn ? '#1e2330' : '#0d1017'
  const panelColor = isLightsOn ? '#2a3142' : '#141822'
  const coveGlowColor = isLightsOn ? '#f59e0b' : '#38bdf8'
  const coveIntensity = isLightsOn ? 2.2 : 1.4

  // Side wall acoustic panel Z-coordinates
  const panelZs = [-10.2, -7.4, -4.6, -1.8, 1.0, 3.8, 6.6, 9.4]

  return (
    <group>
      {/* ═══════ 1. MAIN FLOOR CARPET ═══════ */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 54]} />
        <meshStandardMaterial color={carpetColor} roughness={0.92} metalness={0.08} />
      </mesh>

      {/* ═══════ 2. FRONT SECTION BASE PLATFORM (Rows A-C) ═══════ */}
      <mesh position={[0, 0.02, -8.4]}>
        <boxGeometry args={[17.8, 0.04, 5.0]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════ 3. DYNAMIC TIERED PLATFORMS (Rows D through J) ═══════ */}
      {SEAT_ROWS.filter((r) => r.y > 0.04).map((r) => {
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

      {/* ═══════ 4. CROSS-AISLE WALKWAY (Between Middle & Balcony) ═══════ */}
      <mesh position={[0, 1.35 / 2, 1.8]}>
        <boxGeometry args={[17.8, 1.35, 0.8]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════ 5. AISLE LIGHT STRIPS (Left, Right & Center) ═══════ */}
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

      {/* Center walkway divider line */}
      <mesh position={[0, 0.03, -2]}>
        <boxGeometry args={[0.08, 0.02, 22]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={isLightsOn ? 0.4 : 0.8}
        />
      </mesh>

      {/* ═══════ 6. INWARD-FACING SIDE WALLS (NEVER BLOCK CAMERA) ═══════ */}

      {/* Left Wall Plane (Normals point +X inward; Invisible from outside) */}
      <mesh position={[-13.5, 5.5, -0.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Right Wall Plane (Normals point -X inward; Invisible from outside) */}
      <mesh position={[13.5, 5.5, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Left Wall 3D Acoustic Baffle Panels & LED Strips */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`left-panel-${idx}`}>
          {/* Acoustic 3D Panel */}
          <mesh position={[-13.35, 5.5, z]}>
            <boxGeometry args={[0.2, 9.8, 2.3]} />
            <meshStandardMaterial color={panelColor} roughness={0.7} metalness={0.15} />
          </mesh>

          {/* Vertical Architectural LED Cove Light Strip */}
          <mesh position={[-13.38, 5.5, z + 1.35]}>
            <boxGeometry args={[0.06, 9.4, 0.06]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {/* Sconce Accent Point Light */}
          {idx % 2 === 1 && (
            <pointLight
              position={[-13.0, 5.8, z]}
              intensity={isLightsOn ? 8 : 4}
              distance={7}
              color={coveGlowColor}
            />
          )}

          {/* Dolby Atmos Surround Speaker */}
          {idx % 2 === 0 && (
            <group position={[-13.1, 7.2, z]} rotation={[0, 0, 0.28]}>
              <mesh>
                <boxGeometry args={[0.25, 0.55, 0.38]} />
                <meshStandardMaterial color="#111319" roughness={0.4} metalness={0.6} />
              </mesh>
              <mesh position={[0.13, 0, 0]}>
                <boxGeometry args={[0.02, 0.48, 0.32]} />
                <meshStandardMaterial color="#1e222d" roughness={0.8} />
              </mesh>
              <mesh position={[0.14, -0.2, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.03]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* Right Wall 3D Acoustic Baffle Panels & LED Strips */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`right-panel-${idx}`}>
          {/* Acoustic 3D Panel */}
          <mesh position={[13.35, 5.5, z]}>
            <boxGeometry args={[0.2, 9.8, 2.3]} />
            <meshStandardMaterial color={panelColor} roughness={0.7} metalness={0.15} />
          </mesh>

          {/* Vertical Architectural LED Cove Light Strip */}
          <mesh position={[13.38, 5.5, z + 1.35]}>
            <boxGeometry args={[0.06, 9.4, 0.06]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {/* Sconce Accent Point Light */}
          {idx % 2 === 1 && (
            <pointLight
              position={[13.0, 5.8, z]}
              intensity={isLightsOn ? 8 : 4}
              distance={7}
              color={coveGlowColor}
            />
          )}

          {/* Dolby Atmos Surround Speaker */}
          {idx % 2 === 0 && (
            <group position={[13.1, 7.2, z]} rotation={[0, 0, -0.28]}>
              <mesh>
                <boxGeometry args={[0.25, 0.55, 0.38]} />
                <meshStandardMaterial color="#111319" roughness={0.4} metalness={0.6} />
              </mesh>
              <mesh position={[-0.13, 0, 0]}>
                <boxGeometry args={[0.02, 0.48, 0.32]} />
                <meshStandardMaterial color="#1e222d" roughness={0.8} />
              </mesh>
              <mesh position={[-0.14, -0.2, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.03]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* Horizontal LED Crown Cove Lighting */}
      <mesh position={[-13.3, 10.6, -0.4]}>
        <boxGeometry args={[0.08, 0.06, 26]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[13.3, 10.6, -0.4]}>
        <boxGeometry args={[0.08, 0.06, 26]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.5} />
      </mesh>

      {/* ═══════ 7. REAR WALL (INWARD FACING, NORMALS POINT -Z) ═══════ */}
      {/* Rear Wall Plane (Points -Z inward toward screen; Invisible from behind so it NEVER blocks view!) */}
      <mesh position={[0, 5.5, 13.2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[27, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Projectionist Booth Window (Rendered on inside face) */}
      <group position={[0, 7.2, 13.0]}>
        <mesh>
          <boxGeometry args={[4.2, 1.6, 0.1]} />
          <meshStandardMaterial color="#0a0c12" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[3.8, 1.2]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={isLightsOn ? 0.8 : 2.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        <pointLight
          position={[0, 0, -0.3]}
          intensity={isLightsOn ? 10 : 20}
          distance={16}
          color="#bae6fd"
        />
      </group>

      {/* Left Emergency Exit Door */}
      <group position={[-9.6, 1.8, 13.0]}>
        <mesh>
          <boxGeometry args={[1.6, 3.2, 0.1]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.4, 3.0]} />
          <meshStandardMaterial color="#0f1218" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.85, -0.08]}>
          <boxGeometry args={[1.3, 0.4, 0.04]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3.5} />
        </mesh>
      </group>

      {/* Right Emergency Exit Door */}
      <group position={[9.6, 1.8, 13.0]}>
        <mesh>
          <boxGeometry args={[1.6, 3.2, 0.1]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[1.4, 3.0]} />
          <meshStandardMaterial color="#0f1218" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.85, -0.08]}>
          <boxGeometry args={[1.3, 0.4, 0.04]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3.5} />
        </mesh>
      </group>

      {/* ═══════ 8. AUDITORIUM HOUSE DOWNLIGHTS ═══════ */}
      {isLightsOn && (
        <>
          <pointLight position={[0, 9.8, -7]} intensity={28} distance={18} color="#fef3c7" />
          <pointLight position={[0, 9.8, -1]} intensity={32} distance={18} color="#fef3c7" />
          <pointLight position={[0, 10.5, 5]} intensity={34} distance={20} color="#fef3c7" />
          <pointLight position={[-5, 9.2, 0]} intensity={20} distance={15} color="#fde68a" />
          <pointLight position={[5, 9.2, 0]} intensity={20} distance={15} color="#fde68a" />
        </>
      )}
    </group>
  )
}
