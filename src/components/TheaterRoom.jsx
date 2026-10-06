import React from 'react'
import { SEAT_ROWS } from '../data/cinemaData'

/*
  TheaterRoom — Premium Architectural Cinema Auditorium
  - 3D Acoustic Baffle Wall Panels with depth, texture, and rhythm
  - Architectural vertical LED cove lighting strips between panels
  - Wall-mounted angled Dolby Atmos surround speakers along both sides
  - Rear wall projectionist booth window with soft optical glass glow
  - Dual emergency exit doors with illuminated green EXIT signs
  - Ceiling acoustic clouds with recessed downlight fixtures
  - Mathematically aligned tier steps so all seats rest perfectly on top
*/

export default function TheaterRoom({ isLightsOn = true }) {
  // Auditorium color palette
  const carpetColor = isLightsOn ? '#1a1e28' : '#0e1118'
  const platformColor = isLightsOn ? '#222736' : '#141822'
  const wallBaseColor = isLightsOn ? '#1c202c' : '#0b0e16'
  const panelColor = isLightsOn ? '#282e3d' : '#131722'
  const trimColor = '#0a0d14'
  const coveGlowColor = isLightsOn ? '#f59e0b' : '#38bdf8'
  const coveIntensity = isLightsOn ? 2.2 : 1.4

  // Side wall acoustic panel Z-coordinates
  const panelZs = [-10.2, -7.4, -4.6, -1.8, 1.0, 3.8, 6.6, 9.4]

  return (
    <group>
      {/* ═══════ 1. MAIN FLOOR CARPET WITH LUXURY BORDER ═══════ */}
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

      {/* ═══════ 6. 3D ARCHITECTURAL WALLS & ACOUSTIC PANELS ═══════ */}

      {/* Left Wall Base */}
      <mesh position={[-12.2, 5.5, -0.4]}>
        <boxGeometry args={[0.4, 12, 26]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Right Wall Base */}
      <mesh position={[12.2, 5.5, -0.4]}>
        <boxGeometry args={[0.4, 12, 26]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Left Wall 3D Acoustic Baffle Panels & Vertical LED Strips */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`left-panel-${idx}`}>
          {/* Acoustic 3D Panel */}
          <mesh position={[-11.95, 5.5, z]}>
            <boxGeometry args={[0.2, 9.8, 2.3]} />
            <meshStandardMaterial color={panelColor} roughness={0.7} metalness={0.15} />
          </mesh>

          {/* Panel Top & Bottom Trim */}
          <mesh position={[-11.88, 10.4, z]}>
            <boxGeometry args={[0.24, 0.12, 2.34]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-11.88, 0.6, z]}>
            <boxGeometry args={[0.24, 0.12, 2.34]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Vertical Architectural LED Cove Light Strip (Between Panels) */}
          <mesh position={[-11.98, 5.5, z + 1.35]}>
            <boxGeometry args={[0.08, 9.4, 0.08]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {/* Sconce Accent Point Light */}
          {idx % 2 === 1 && (
            <pointLight
              position={[-11.6, 5.8, z]}
              intensity={isLightsOn ? 9 : 5}
              distance={8}
              color={coveGlowColor}
            />
          )}

          {/* Dolby Atmos Surround Speaker (Mounted on wall) */}
          {idx % 2 === 0 && (
            <group position={[-11.8, 7.2, z]} rotation={[0, 0, 0.28]}>
              {/* Speaker Cabinet */}
              <mesh>
                <boxGeometry args={[0.25, 0.55, 0.38]} />
                <meshStandardMaterial color="#111319" roughness={0.4} metalness={0.6} />
              </mesh>
              {/* Speaker Grille */}
              <mesh position={[0.13, 0, 0]}>
                <boxGeometry args={[0.02, 0.48, 0.32]} />
                <meshStandardMaterial color="#1e222d" roughness={0.8} />
              </mesh>
              {/* Dolby Blue Status LED */}
              <mesh position={[0.14, -0.2, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.03]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* Right Wall 3D Acoustic Baffle Panels & Vertical LED Strips */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`right-panel-${idx}`}>
          {/* Acoustic 3D Panel */}
          <mesh position={[11.95, 5.5, z]}>
            <boxGeometry args={[0.2, 9.8, 2.3]} />
            <meshStandardMaterial color={panelColor} roughness={0.7} metalness={0.15} />
          </mesh>

          {/* Panel Top & Bottom Trim */}
          <mesh position={[11.88, 10.4, z]}>
            <boxGeometry args={[0.24, 0.12, 2.34]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[11.88, 0.6, z]}>
            <boxGeometry args={[0.24, 0.12, 2.34]} />
            <meshStandardMaterial color={trimColor} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Vertical Architectural LED Cove Light Strip (Between Panels) */}
          <mesh position={[11.98, 5.5, z + 1.35]}>
            <boxGeometry args={[0.08, 9.4, 0.08]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {/* Sconce Accent Point Light */}
          {idx % 2 === 1 && (
            <pointLight
              position={[11.6, 5.8, z]}
              intensity={isLightsOn ? 9 : 5}
              distance={8}
              color={coveGlowColor}
            />
          )}

          {/* Dolby Atmos Surround Speaker (Mounted on wall) */}
          {idx % 2 === 0 && (
            <group position={[11.8, 7.2, z]} rotation={[0, 0, -0.28]}>
              {/* Speaker Cabinet */}
              <mesh>
                <boxGeometry args={[0.25, 0.55, 0.38]} />
                <meshStandardMaterial color="#111319" roughness={0.4} metalness={0.6} />
              </mesh>
              {/* Speaker Grille */}
              <mesh position={[-0.13, 0, 0]}>
                <boxGeometry args={[0.02, 0.48, 0.32]} />
                <meshStandardMaterial color="#1e222d" roughness={0.8} />
              </mesh>
              {/* Dolby Blue Status LED */}
              <mesh position={[-0.14, -0.2, 0]}>
                <boxGeometry args={[0.01, 0.03, 0.03]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* Horizontal LED Crown Cove Lighting along top of walls */}
      <mesh position={[-11.9, 10.6, -0.4]}>
        <boxGeometry args={[0.1, 0.06, 25.5]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[11.9, 10.6, -0.4]}>
        <boxGeometry args={[0.1, 0.06, 25.5]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.5} />
      </mesh>

      {/* ═══════ 7. REAR WALL WITH PROJECTION BOOTH & EXIT DOORS ═══════ */}
      {/* Rear Wall Base */}
      <mesh position={[0, 5.5, 12.6]}>
        <boxGeometry args={[24.8, 12, 0.4]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.9} />
      </mesh>

      {/* Rear Wall Acoustic Panels */}
      {[-7.5, -4.5, 4.5, 7.5].map((x, i) => (
        <mesh key={`rear-panel-${i}`} position={[x, 5.5, 12.35]}>
          <boxGeometry args={[2.5, 9.8, 0.15]} />
          <meshStandardMaterial color={panelColor} roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Projectionist Booth Window (Centered high on rear wall) */}
      <group position={[0, 7.2, 12.35]}>
        {/* Booth Frame */}
        <mesh>
          <boxGeometry args={[4.2, 1.6, 0.2]} />
          <meshStandardMaterial color="#0a0c12" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Booth Optical Glass Window */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3.8, 1.2]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={isLightsOn ? 0.8 : 2.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Projector Light Beam originating from booth */}
        <pointLight
          position={[0, 0, -0.2]}
          intensity={isLightsOn ? 12 : 25}
          distance={18}
          color="#bae6fd"
        />
      </group>

      {/* Left Emergency Exit Door */}
      <group position={[-9.6, 1.8, 12.35]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[1.6, 3.2, 0.15]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Door Panel */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.4, 3.0, 0.05]} />
          <meshStandardMaterial color="#0f1218" roughness={0.6} />
        </mesh>
        {/* Push Bar */}
        <mesh position={[0, -0.1, 0.12]}>
          <boxGeometry args={[1.2, 0.06, 0.06]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
        </mesh>
        {/* Illuminated Green EXIT Sign */}
        <mesh position={[0, 1.85, 0.1]}>
          <boxGeometry args={[1.3, 0.4, 0.06]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3.5} />
        </mesh>
        <pointLight position={[0, 1.85, 0.3]} intensity={4} distance={4} color="#22c55e" />
      </group>

      {/* Right Emergency Exit Door */}
      <group position={[9.6, 1.8, 12.35]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[1.6, 3.2, 0.15]} />
          <meshStandardMaterial color="#1a1c24" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Door Panel */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.4, 3.0, 0.05]} />
          <meshStandardMaterial color="#0f1218" roughness={0.6} />
        </mesh>
        {/* Push Bar */}
        <mesh position={[0, -0.1, 0.12]}>
          <boxGeometry args={[1.2, 0.06, 0.06]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
        </mesh>
        {/* Illuminated Green EXIT Sign */}
        <mesh position={[0, 1.85, 0.1]}>
          <boxGeometry args={[1.3, 0.4, 0.06]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3.5} />
        </mesh>
        <pointLight position={[0, 1.85, 0.3]} intensity={4} distance={4} color="#22c55e" />
      </group>

      {/* ═══════ 8. CEILING ACOUSTIC CLOUDS & RECESSED SPOTLIGHTS ═══════ */}
      {/* Stepped Floating Ceiling Panels */}
      {[-8, -2, 4].map((z, idx) => (
        <group key={`ceiling-cloud-${idx}`} position={[0, 11.2, z]}>
          <mesh>
            <boxGeometry args={[22, 0.25, 4.5]} />
            <meshStandardMaterial color={isLightsOn ? '#171a24' : '#090b10'} roughness={0.9} />
          </mesh>
          {/* Recessed Lighting Pots */}
          {[-6, 0, 6].map((x, j) => (
            <mesh key={`recess-${j}`} position={[x, -0.14, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
              <meshStandardMaterial
                color={isLightsOn ? '#fef3c7' : '#38bdf8'}
                emissive={isLightsOn ? '#fef3c7' : '#38bdf8'}
                emissiveIntensity={isLightsOn ? 2.5 : 0.6}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* ═══════ 9. AUDITORIUM HOUSE DOWNLIGHTS ═══════ */}
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
