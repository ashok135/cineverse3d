import React from 'react'
import { SEAT_ROWS } from '../data/cinemaData'

/*
  TheaterRoom — Premium IMAX-Style Cinema Auditorium
  ───────────────────────────────────────────────────
  Immersive, realistic theater environment with:
  • Carpeted tiered floor with runner strips
  • Full ceiling with recessed downlights & starfield fiber optics
  • Fabric-clad acoustic wall panels with warm sconces
  • Dolby Atmos speakers with indicator LEDs
  • Luxury aisle runner lighting (warm amber)
  • Rear wall with projection booth, exit doors & signage
  • Proper entryway aesthetic

  Architecture: Single-sided (backface culled) so the camera never gets blocked.
*/

export default function TheaterRoom({ isLightsOn = true }) {
  // ─── Premium Color Palette ───
  const carpetColor = isLightsOn ? '#1a1220' : '#0c0814'
  const carpetAccent = isLightsOn ? '#251830' : '#120c1a'
  const platformColor = isLightsOn ? '#1e1628' : '#0e0a16'
  const platformEdge = isLightsOn ? '#2a1f38' : '#16101e'
  const wallBaseColor = isLightsOn ? '#181220' : '#0a0710'
  const panelFabricColor = isLightsOn ? '#221a30' : '#110d1a'
  const panelFrameColor = isLightsOn ? '#342848' : '#1a1428'
  const ceilingColor = isLightsOn ? '#0f0a18' : '#060410'
  const coveGlowColor = isLightsOn ? '#f59e0b' : '#6366f1'
  const coveIntensity = isLightsOn ? 2.0 : 1.2
  const sconceBrightness = isLightsOn ? 8 : 3

  // Side wall panel positions
  const panelZs = [-10.2, -7.4, -4.6, -1.8, 1.0, 3.8, 6.6, 9.4]

  return (
    <group>
      {/* ═══════════════════════════════════════════════
          1. MAIN FLOOR — Rich cinema carpet with pattern
          ═══════════════════════════════════════════════ */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 54]} />
        <meshStandardMaterial color={carpetColor} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Carpet runner pattern strips (decorative) */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <mesh key={`runner-${i}`} position={[x, -0.015, -2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 22]} />
          <meshStandardMaterial
            color={carpetAccent}
            roughness={0.9}
            emissive={carpetAccent}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════
          2. FRONT PROSCENIUM STAGE / SCREEN APRON
          ═══════════════════════════════════════════════ */}
      <mesh position={[0, 0.05, -10.2]}>
        <boxGeometry args={[18.4, 0.10, 6.4]} />
        <meshStandardMaterial color={platformColor} roughness={0.92} />
      </mesh>
      {/* Stage LED safety strip */}
      <mesh position={[0, 0.105, -7.0]}>
        <boxGeometry args={[17.6, 0.015, 0.025]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={isLightsOn ? 1.0 : 2.5}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════
          3. TIERED PLATFORMS (Rows A–J) with carpet edges
          ═══════════════════════════════════════════════ */}
      {SEAT_ROWS.map((r) => {
        const height = r.y
        const centerY = r.y / 2
        const depth = 1.58

        return (
          <React.Fragment key={`platform-${r.name}`}>
            {/* Solid platform riser */}
            <mesh position={[0, centerY, r.z]}>
              <boxGeometry args={[17.8, height, depth]} />
              <meshStandardMaterial color={platformColor} roughness={0.88} />
            </mesh>

            {/* Step face — slightly lighter carpet edge */}
            <mesh position={[0, centerY, r.z - depth / 2 - 0.01]}>
              <planeGeometry args={[17.6, height]} />
              <meshStandardMaterial color={platformEdge} roughness={0.85} />
            </mesh>

            {/* LED safety step edge (recessed into step) */}
            <mesh position={[0, r.y + 0.012, r.z - depth / 2 + 0.01]}>
              <boxGeometry args={[16.4, 0.018, 0.025]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={isLightsOn ? 1.2 : 2.8}
              />
            </mesh>
          </React.Fragment>
        )
      })}

      {/* ═══════════════════════════════════════════════
          4. CROSS-AISLE WALKWAYS
          ═══════════════════════════════════════════════ */}
      {/* Front-to-Middle Cross-Aisle (between Rows C and D) */}
      <mesh position={[0, 0.93 / 2, -1.9]}>
        <boxGeometry args={[17.8, 0.93, 0.62]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>
      {/* Middle-to-Balcony Cross-Aisle (between Rows G and H) */}
      <mesh position={[0, 2.62 / 2, 5.1]}>
        <boxGeometry args={[17.8, 2.62, 0.62]} />
        <meshStandardMaterial color={platformColor} roughness={0.85} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          5. AISLE RUNNER LIGHTING (Left, Right, Center)
          ═══════════════════════════════════════════════ */}
      {/* Left aisle runner */}
      <mesh position={[-7.8, 0.04, 1.0]}>
        <boxGeometry args={[0.06, 0.015, 23]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
      </mesh>
      <pointLight
        position={[-7.8, 0.4, 1.0]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Right aisle runner */}
      <mesh position={[7.8, 0.04, 1.0]}>
        <boxGeometry args={[0.06, 0.015, 23]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} />
      </mesh>
      <pointLight
        position={[7.8, 0.4, 1.0]}
        intensity={isLightsOn ? 2 : 4}
        distance={6}
        color="#f59e0b"
      />

      {/* Center divider (dark aisle seam) */}
      <mesh position={[0, 0.03, 1.0]}>
        <boxGeometry args={[0.06, 0.012, 23]} />
        <meshStandardMaterial
          color="#1a1d24"
          roughness={0.9}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════
          6. WALLS — Front Proscenium & Side Fabric Acoustic Panels
          ═══════════════════════════════════════════════ */}
      {/* Front Proscenium Acoustic Wall (behind screen) */}
      <mesh position={[0, 5.5, -14.4]}>
        <planeGeometry args={[27, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.96} />
      </mesh>

      {/* Left wall base plane */}
      <mesh position={[-13.5, 5.5, -0.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.92} />
      </mesh>

      {/* Right wall base plane */}
      <mesh position={[13.5, 5.5, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.92} />
      </mesh>

      {/* ── Left Wall: Acoustic panels, sconces, speakers ── */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`left-panel-${idx}`}>
          {/* Framed acoustic panel — outer frame */}
          <mesh position={[-13.38, 5.2, z]}>
            <boxGeometry args={[0.15, 8.5, 2.4]} />
            <meshStandardMaterial color={panelFrameColor} roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Inner fabric panel face */}
          <mesh position={[-13.28, 5.2, z]}>
            <boxGeometry args={[0.08, 8.0, 2.1]} />
            <meshStandardMaterial color={panelFabricColor} roughness={0.92} metalness={0.02} />
          </mesh>

          {/* Vertical LED cove strip (between panels) */}
          <mesh position={[-13.40, 5.2, z + 1.3]}>
            <boxGeometry args={[0.04, 8.8, 0.04]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {/* Wall sconce light fixture */}
          {idx % 2 === 1 && (
            <group position={[-13.2, 6.8, z]}>
              {/* Sconce bracket */}
              <mesh>
                <boxGeometry args={[0.12, 0.08, 0.3]} />
                <meshStandardMaterial color="#1a1520" roughness={0.4} metalness={0.7} />
              </mesh>
              {/* Sconce lamp shade */}
              <mesh position={[0.08, 0.06, 0]}>
                <boxGeometry args={[0.04, 0.16, 0.22]} />
                <meshStandardMaterial
                  color="#fef3c7"
                  emissive="#f59e0b"
                  emissiveIntensity={isLightsOn ? 3 : 0.8}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              <pointLight
                position={[0.15, 0, 0]}
                intensity={sconceBrightness}
                distance={6}
                color={isLightsOn ? '#fde68a' : '#a78bfa'}
              />
            </group>
          )}

          {/* Dolby Atmos surround speaker */}
          {idx % 2 === 0 && (
            <group position={[-13.15, 7.8, z]} rotation={[0, 0, 0.22]}>
              {/* Speaker enclosure */}
              <mesh>
                <boxGeometry args={[0.22, 0.50, 0.36]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.65} />
              </mesh>
              {/* Speaker grille */}
              <mesh position={[0.12, 0, 0]}>
                <boxGeometry args={[0.02, 0.44, 0.30]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
              </mesh>
              {/* Status LED */}
              <mesh position={[0.13, -0.20, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* ── Right Wall: Acoustic panels, sconces, speakers ── */}
      {panelZs.map((z, idx) => (
        <React.Fragment key={`right-panel-${idx}`}>
          <mesh position={[13.38, 5.2, z]}>
            <boxGeometry args={[0.15, 8.5, 2.4]} />
            <meshStandardMaterial color={panelFrameColor} roughness={0.6} metalness={0.2} />
          </mesh>

          <mesh position={[13.28, 5.2, z]}>
            <boxGeometry args={[0.08, 8.0, 2.1]} />
            <meshStandardMaterial color={panelFabricColor} roughness={0.92} metalness={0.02} />
          </mesh>

          <mesh position={[13.40, 5.2, z + 1.3]}>
            <boxGeometry args={[0.04, 8.8, 0.04]} />
            <meshStandardMaterial
              color={coveGlowColor}
              emissive={coveGlowColor}
              emissiveIntensity={coveIntensity}
            />
          </mesh>

          {idx % 2 === 1 && (
            <group position={[13.2, 6.8, z]}>
              <mesh>
                <boxGeometry args={[0.12, 0.08, 0.3]} />
                <meshStandardMaterial color="#1a1520" roughness={0.4} metalness={0.7} />
              </mesh>
              <mesh position={[-0.08, 0.06, 0]}>
                <boxGeometry args={[0.04, 0.16, 0.22]} />
                <meshStandardMaterial
                  color="#fef3c7"
                  emissive="#f59e0b"
                  emissiveIntensity={isLightsOn ? 3 : 0.8}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              <pointLight
                position={[-0.15, 0, 0]}
                intensity={sconceBrightness}
                distance={6}
                color={isLightsOn ? '#fde68a' : '#a78bfa'}
              />
            </group>
          )}

          {idx % 2 === 0 && (
            <group position={[13.15, 7.8, z]} rotation={[0, 0, -0.22]}>
              <mesh>
                <boxGeometry args={[0.22, 0.50, 0.36]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.35} metalness={0.65} />
              </mesh>
              <mesh position={[-0.12, 0, 0]}>
                <boxGeometry args={[0.02, 0.44, 0.30]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
              </mesh>
              <mesh position={[-0.13, -0.20, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={4} />
              </mesh>
            </group>
          )}
        </React.Fragment>
      ))}

      {/* ── Crown Cove LED strips (top of walls) ── */}
      <mesh position={[-13.35, 10.6, -0.4]}>
        <boxGeometry args={[0.06, 0.05, 26]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[13.35, 10.6, -0.4]}>
        <boxGeometry args={[0.06, 0.05, 26]} />
        <meshStandardMaterial color={coveGlowColor} emissive={coveGlowColor} emissiveIntensity={2.2} />
      </mesh>

      {/* ═══════════════════════════════════════════════
          7. CEILING — Dark with recessed downlights & fiber optic stars
          ═══════════════════════════════════════════════ */}

      {/* Main ceiling plane */}
      <mesh position={[0, 11.5, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[27, 28]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.95} />
      </mesh>

      {/* Ceiling recessed tray (decorative border) */}
      <mesh position={[0, 11.4, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 25]} />
        <meshStandardMaterial
          color={isLightsOn ? '#120e1c' : '#050308'}
          roughness={0.95}
        />
      </mesh>

      {/* Fiber optic starfield — tiny glowing dots on ceiling */}
      {[
        [-4, 11.45, -6], [2, 11.45, -8], [-6, 11.45, 2], [5, 11.45, 4],
        [-2, 11.45, 7], [8, 11.45, -3], [-8, 11.45, -5], [3, 11.45, 1],
        [-5, 11.45, -1], [6, 11.45, 8], [-1, 11.45, -10], [4, 11.45, -4],
        [-7, 11.45, 5], [1, 11.45, 9], [-3, 11.45, -7], [7, 11.45, 0],
        [0, 11.45, 3], [-9, 11.45, -2], [9, 11.45, 6], [-4.5, 11.45, 10],
        [2.5, 11.45, -9], [-6.5, 11.45, 3.5], [5.5, 11.45, -6.5], [-1.5, 11.45, 5.5],
        [8.5, 11.45, 2.5], [-3.5, 11.45, -4.5], [3.5, 11.45, 7.5], [-8.5, 11.45, 1.5],
        [6.5, 11.45, -1.5], [0.5, 11.45, -3.5],
        [-2.8, 11.45, 0.8], [4.3, 11.45, -2.3], [-7.2, 11.45, 7.8], [1.7, 11.45, 5.2],
        [9.2, 11.45, -7.8], [-5.3, 11.45, -8.3], [7.8, 11.45, 3.8], [-0.7, 11.45, -5.7],
        [3.2, 11.45, -0.2], [-9.8, 11.45, -6.2],
      ].map((pos, i) => (
        <mesh key={`star-${i}`} position={pos}>
          <sphereGeometry args={[0.025 + Math.random() * 0.015, 6, 6]} />
          <meshStandardMaterial
            color="#e0e7ff"
            emissive="#c7d2fe"
            emissiveIntensity={isLightsOn ? 0.5 : 3.5}
          />
        </mesh>
      ))}

      {/* Recessed ceiling downlights (3 rows across auditorium) */}
      {[
        [-6, 11.42, -7], [-2, 11.42, -7], [2, 11.42, -7], [6, 11.42, -7],
        [-6, 11.42, -1], [-2, 11.42, -1], [2, 11.42, -1], [6, 11.42, -1],
        [-6, 11.42, 5], [-2, 11.42, 5], [2, 11.42, 5], [6, 11.42, 5],
      ].map((pos, i) => (
        <React.Fragment key={`downlight-${i}`}>
          {/* Light housing ring */}
          <mesh position={pos}>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
            <meshStandardMaterial color="#1a1520" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Light face */}
          <mesh position={[pos[0], pos[1] - 0.03, pos[2]]}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={isLightsOn ? 3 : 0.2}
            />
          </mesh>
        </React.Fragment>
      ))}

      {/* ═══════════════════════════════════════════════
          8. REAR WALL (inward facing, projection booth, exits)
          ═══════════════════════════════════════════════ */}
      <mesh position={[0, 5.5, 13.2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[27, 12]} />
        <meshStandardMaterial color={wallBaseColor} roughness={0.92} />
      </mesh>

      {/* Rear wall fabric panel strips */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <mesh key={`rear-panel-${i}`} position={[x, 5.5, 13.1]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.5, 10]} />
          <meshStandardMaterial color={panelFabricColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Projectionist booth window */}
      <group position={[0, 7.8, 13.0]}>
        {/* Window frame */}
        <mesh>
          <boxGeometry args={[4.6, 1.8, 0.12]} />
          <meshStandardMaterial color="#0a0810" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glass pane with projector glow */}
        <mesh position={[0, 0, -0.07]}>
          <planeGeometry args={[4.0, 1.3]} />
          <meshStandardMaterial
            color="#0c1425"
            emissive="#3b82f6"
            emissiveIntensity={isLightsOn ? 0.6 : 2.0}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
        {/* Projector beam light */}
        <pointLight
          position={[0, 0, -0.4]}
          intensity={isLightsOn ? 8 : 18}
          distance={16}
          color="#bfdbfe"
        />
      </group>

      {/* ── Emergency Exit Doors ── */}
      {[-9.6, 9.6].map((x, i) => (
        <group key={`exit-${i}`} position={[x, 1.8, 13.0]}>
          {/* Door frame */}
          <mesh>
            <boxGeometry args={[1.7, 3.4, 0.12]} />
            <meshStandardMaterial color="#121018" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* Door panel (recessed) */}
          <mesh position={[0, 0, -0.07]}>
            <planeGeometry args={[1.4, 3.0]} />
            <meshStandardMaterial color="#0c0a14" roughness={0.6} />
          </mesh>
          {/* Door handle */}
          <mesh position={[x > 0 ? -0.5 : 0.5, -0.2, -0.1]}>
            <boxGeometry args={[0.08, 0.25, 0.06]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* EXIT sign (illuminated) */}
          <mesh position={[0, 1.92, -0.08]}>
            <boxGeometry args={[1.3, 0.4, 0.04]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={3.5}
            />
          </mesh>
        </group>
      ))}

      {/* ═══════════════════════════════════════════════
          9. AUDITORIUM HOUSE DOWNLIGHTS (from ceiling fixtures)
          ═══════════════════════════════════════════════ */}
      {isLightsOn && (
        <>
          <pointLight position={[0, 10.5, -7]} intensity={26} distance={18} color="#fef3c7" />
          <pointLight position={[0, 10.5, -1]} intensity={30} distance={18} color="#fef3c7" />
          <pointLight position={[0, 10.5, 5]} intensity={32} distance={20} color="#fef3c7" />
          <pointLight position={[-5, 10.0, 0]} intensity={18} distance={15} color="#fde68a" />
          <pointLight position={[5, 10.0, 0]} intensity={18} distance={15} color="#fde68a" />
        </>
      )}

      {/* Movie mode: subtle purple/blue atmospheric wash from ceiling */}
      {!isLightsOn && (
        <>
          <pointLight position={[0, 10.5, -4]} intensity={4} distance={14} color="#6366f1" />
          <pointLight position={[-6, 10.0, 3]} intensity={3} distance={12} color="#8b5cf6" />
          <pointLight position={[6, 10.0, 3]} intensity={3} distance={12} color="#8b5cf6" />
        </>
      )}
    </group>
  )
}
