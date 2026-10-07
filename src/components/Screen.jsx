import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react'
import { useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'

/*
  Screen — Zero-Shadow Guaranteed 3D Cinema Projection Screen
  - Uses @react-three/drei's useVideoTexture with Suspense for guaranteed hardware-accelerated video playback
  - meshBasicMaterial: 100% UNLIT — immune to all room shadows, lighting angles, or dark spots (ZERO SHADOW!)
  - toneMapped={false}: full OLED / laser vibrant saturation and contrast
  - Supports multiple local 4K & IMAX trailers with instant switching
*/

export const LOCAL_VIDEOS = [
  {
    id: 'sample',
    title: 'Cinematic 4K Nature Symphony',
    src: '/videos/sample-trailer.mp4',
  },
  {
    id: 'oceans',
    title: 'IMAX Oceans Deep Sea Feature',
    src: '/videos/oceans-trailer.mp4',
  },
]

function ScreenFallback({ themeColor = '#0284c7' }) {
  return (
    <meshBasicMaterial
      color="#0a192f"
      toneMapped={false}
      side={THREE.FrontSide}
    />
  )
}

function VideoMaterial({ src, isMuted, onVideoReady }) {
  const texture = useVideoTexture(src, {
    muted: true, // Always start muted so browsers NEVER block autoplay
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: 'anonymous',
  })

  const onVideoReadyRef = useRef(onVideoReady)
  useEffect(() => {
    onVideoReadyRef.current = onVideoReady
  }, [onVideoReady])

  // Sync video instance when texture is created / changed
  useEffect(() => {
    const video = texture?.image
    if (!video) return

    video.muted = isMuted
    if (onVideoReadyRef.current) {
      onVideoReadyRef.current(video)
    }

    if (video.paused) {
      video.play().catch(() => {})
    }

    return () => {
      // Pause only when texture is unmounted or replaced
      try {
        if (video) {
          video.pause()
        }
      } catch (e) {}
    }
  }, [texture])

  // Sync mute state dynamically without re-triggering video ready or unpause cycles
  useEffect(() => {
    const video = texture?.image
    if (!video) return
    video.muted = isMuted
    if (!isMuted && video.paused) {
      video.play().catch(() => {})
    }
  }, [texture, isMuted])

  return (
    <meshBasicMaterial
      map={texture}
      toneMapped={false}
      side={THREE.FrontSide}
    />
  )
}

export default function Screen({
  movie,
  theater,
  showtime,
  videoIndex = 0,
  isMuted = true,
  isLightsOn = true,
  position = [0, 4.5, -14],
  onVideoReady,
  onNextVideo,
}) {
  const currentVideo = LOCAL_VIDEOS[videoIndex % LOCAL_VIDEOS.length]
  const internalVideoRef = useRef(null)

  const handleVideoReady = useCallback((video) => {
    internalVideoRef.current = video
    if (onVideoReady) {
      onVideoReady(video)
    }
  }, [onVideoReady])

  // Handle click on 3D screen to toggle play/pause or start playback
  const handleScreenClick = (e) => {
    e.stopPropagation()
    const video = internalVideoRef.current
    if (video) {
      if (video.paused) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }
  }

  const themeColor = movie?.themeColor || '#38bdf8'

  return (
    <group position={position}>
      {/* ═══════ 1. RECESSED OUTER BEZEL FRAME ═══════ */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[16.2, 7.6, 0.1]} />
        <meshStandardMaterial color="#05060a" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* ═══════ 2. SCREEN PROJECTION SURFACE (100% ZERO SHADOW) ═══════ */}
      {/* 
        Positioned at z = 0.05 (cleanly flush and forward)
        Uses meshBasicMaterial: completely unaffected by lights, shadows, or scene angles
        toneMapped={false}: full vibrant OLED / laser color
      */}
      <mesh
        position={[0, 0, 0.05]}
        castShadow={false}
        receiveShadow={false}
        onClick={handleScreenClick}
      >
        <planeGeometry args={[15.6, 7.0]} />
        <Suspense fallback={<ScreenFallback themeColor={themeColor} />}>
          <VideoMaterial
            key={currentVideo.src}
            src={currentVideo.src}
            isMuted={isMuted}
            onVideoReady={handleVideoReady}
          />
        </Suspense>
      </mesh>

      {/* ═══════ 3. TOP & BOTTOM BEZEL ACCENTS ═══════ */}
      <mesh position={[0, 3.65, 0.06]}>
        <boxGeometry args={[16.2, 0.04, 0.02]} />
        <meshBasicMaterial color={themeColor} />
      </mesh>
      <mesh position={[0, -3.65, 0.06]}>
        <boxGeometry args={[16.2, 0.04, 0.02]} />
        <meshBasicMaterial color={themeColor} />
      </mesh>

      {/* ═══════ 4. DYNAMIC SCREEN WASH ONTO AUDIENCE ═══════ */}
      <pointLight
        position={[0, 3.2, 3.0]}
        intensity={isLightsOn ? 20 : 50}
        distance={22}
        color={themeColor}
      />
    </group>
  )
}
