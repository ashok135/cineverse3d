import React from 'react'
import { Text } from '@react-three/drei'

export default function Screen({
  movie,
  theater,
  showtime,
  position = [0, 4.5, -14],
}) {
  const title = movie?.title || 'INTERSTELLAR'
  const format = movie?.format || 'IMAX 70MM'
  const sound = movie?.sound || 'DOLBY ATMOS'
  const hall = theater?.hall || 'Auditorium 4 · IMAX Laser'
  const time = showtime || '9:30 PM'
  const themeColor = movie?.themeColor || '#38bdf8'
  const screenColor = movie?.screenColor || '#075985'

  return (
    <group position={position}>
      {/* Outer bezel frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[16, 7.5, 0.2]} />
        <meshStandardMaterial color="#050507" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Screen surface with movie theme glow */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[15.2, 6.8]} />
        <meshStandardMaterial
          color="#0c1929"
          emissive={screenColor}
          emissiveIntensity={0.65}
          roughness={0.05}
        />
      </mesh>

      {/* Bright center projection glow */}
      <mesh position={[0, 0.3, 0.02]}>
        <planeGeometry args={[12, 4.5]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={themeColor}
          emissiveIntensity={0.35}
          transparent
          opacity={0.45}
          roughness={0.0}
        />
      </mesh>

      {/* Movie Title */}
      <Text
        position={[0, 1.0, 0.04]}
        fontSize={title.length > 16 ? 0.78 : 0.95}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
      >
        {title}
      </Text>

      {/* Format & Auditorium Details */}
      <Text
        position={[0, -0.2, 0.04]}
        fontSize={0.27}
        color={themeColor}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {`${format} · ${sound} · ${hall.split('·')[0].trim()}`}
      </Text>

      {/* Showtime */}
      <Text
        position={[0, -0.8, 0.04]}
        fontSize={0.21}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {`TODAY · ${time}`}
      </Text>

      {/* Projector light beam casting onto audience */}
      <spotLight
        position={[0, 0, 4]}
        angle={0.8}
        penumbra={0.7}
        intensity={85}
        distance={25}
        color={themeColor}
      />

      {/* Bottom edge glow strip */}
      <mesh position={[0, -3.45, 0.06]}>
        <boxGeometry args={[15.2, 0.06, 0.06]} />
        <meshStandardMaterial
          color={themeColor}
          emissive={themeColor}
          emissiveIntensity={2.8}
        />
      </mesh>
    </group>
  )
}
