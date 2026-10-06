import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
  Screen — Zero-Shadow Guaranteed Video & Cinema Projection Screen
  - Dual-engine rendering:
    * When video is actively playing: Renders live HD video frames (60 FPS)
    * When video is buffering / awaiting user tap: Renders a dynamic, pulsing animated cinema projection
  - NEVER displays an empty, dark, or static screen!
  - meshBasicMaterial: 100% UNLIT and immune to room shadows or lighting angles (ZERO shadow!)
  - toneMapped={false}: full OLED / IMAX vibrant color reproduction
*/

export const LOCAL_VIDEOS = [
  {
    id: 'oceans',
    title: 'IMAX Oceans Deep Sea Feature',
    src: '/videos/oceans-trailer.mp4',
  },
  {
    id: 'nature',
    title: 'Cinematic 4K Nature Symphony',
    src: '/videos/sample-trailer.mp4',
  },
]

export default function Screen({
  movie,
  theater,
  showtime,
  videoElement,
  videoIndex = 0,
  isMuted = true,
  isLightsOn = true,
  position = [0, 4.5, -14],
  onNextVideo,
}) {
  const currentVideo = LOCAL_VIDEOS[videoIndex % LOCAL_VIDEOS.length]
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const animTime = useRef(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoTexture, setVideoTexture] = useState(null)

  // 1. Initialize internal Video & Canvas
  useEffect(() => {
    // Canvas setup
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 720
    canvasRef.current = canvas

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = false
    textureRef.current = texture
    setVideoTexture(texture)

    // Setup Video
    let video = videoElement || document.getElementById('cinema-active-video')
    let isInternal = false

    if (!video) {
      isInternal = true
      video = document.createElement('video')
      video.src = currentVideo.src
      video.loop = true
      video.muted = isMuted
      video.playsInline = true
      video.autoplay = true
      video.crossOrigin = 'anonymous'
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)

    // Attempt muted autoplay
    video.muted = isMuted
    video.play().then(() => setIsPlaying(true)).catch(() => {
      // Autoplay blocked: will start on first user tap
      setIsPlaying(false)
    })

    // Listen for global user click/touch to start video
    const handleUserGesture = () => {
      if (video && video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }

    window.addEventListener('click', handleUserGesture, { once: true })
    window.addEventListener('touchstart', handleUserGesture, { once: true })

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      window.removeEventListener('click', handleUserGesture)
      window.removeEventListener('touchstart', handleUserGesture)
      if (isInternal) {
        video.pause()
        video.removeAttribute('src')
      }
      texture.dispose()
    }
  }, [currentVideo.src, videoIndex, videoElement])

  // Sync mute state dynamically
  useEffect(() => {
    const video = videoElement || document.getElementById('cinema-active-video')
    if (video) {
      video.muted = isMuted
      if (!isMuted && video.paused) {
        video.play().catch(() => {})
      }
    }
  }, [isMuted, videoElement])

  // 2. Render Loop: Draw video frames OR animated cinema visual
  useFrame((state, delta) => {
    const canvas = canvasRef.current
    const texture = textureRef.current
    if (!canvas || !texture) return

    animTime.current += delta
    const ctx = canvas.getContext('2d')
    const t = animTime.current
    const video = videoElement || document.getElementById('cinema-active-video')

    const hasVideoFrames = video && !video.paused && video.readyState >= 2 && video.currentTime > 0

    if (hasVideoFrames) {
      // ── MODE A: LIVE VIDEO RENDERING ──
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        texture.needsUpdate = true
        return
      } catch (err) {
        // Fall back to animated graphic if cross-origin or decode hitch occurs
      }
    }

    // ── MODE B: DYNAMIC ANIMATED CINEMA PROJECTION (NEVER BLANK!) ──
    const movieTitle = movie?.title || 'INTERSTELLAR'
    const themeCol = movie?.themeColor || '#38bdf8'

    // Deep theatrical gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#04060d')
    grad.addColorStop(0.5, '#0a1020')
    grad.addColorStop(1, '#020408')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Animated holographic grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
    ctx.lineWidth = 1
    const gridOffset = (t * 40) % 60
    for (let x = gridOffset; x < canvas.width; x += 60) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Center pulsating projector glow
    const pulseRadius = 260 + Math.sin(t * 3) * 40
    const glowGrad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      20,
      canvas.width / 2,
      canvas.height / 2,
      pulseRadius
    )
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)')
    glowGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)')
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Top Category Tag
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '4px'
    ctx.fillText('● CINEMA 4K LASER PROJECTION', canvas.width / 2, 220)

    // Big Glowing Movie Title
    ctx.fillStyle = '#ffffff'
    ctx.font = '900 68px system-ui, -apple-system, sans-serif'
    ctx.letterSpacing = '8px'
    ctx.shadowColor = themeCol
    ctx.shadowBlur = 25
    ctx.fillText(movieTitle.toUpperCase(), canvas.width / 2, 330)
    ctx.shadowBlur = 0

    // Subtitle & Format
    ctx.fillStyle = themeCol
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
    ctx.letterSpacing = '3px'
    ctx.fillText(`IMAX 70MM · DOLBY ATMOS · ${currentVideo.title.toUpperCase()}`, canvas.width / 2, 390)

    // Tap to Start Callout Badge
    const btnAlpha = 0.85 + Math.sin(t * 4) * 0.15
    ctx.fillStyle = `rgba(16, 185, 129, ${btnAlpha})`
    ctx.beginPath()
    ctx.roundRect(canvas.width / 2 - 190, 460, 380, 64, 32)
    ctx.fill()

    ctx.fillStyle = '#000000'
    ctx.font = '900 24px system-ui, -apple-system, sans-serif'
    ctx.letterSpacing = '2px'
    ctx.fillText('▶ TAP SCREEN TO PLAY VIDEO', canvas.width / 2, 500)

    // Bottom Audio Visualizer equalizer bars
    const barCount = 48
    const barWidth = 14
    const spacing = 10
    const startX = (canvas.width - barCount * (barWidth + spacing)) / 2

    for (let i = 0; i < barCount; i++) {
      const h = Math.abs(Math.sin(t * 4 + i * 0.35)) * 65 + 10
      const bx = startX + i * (barWidth + spacing)
      const by = canvas.height - 80 - h

      const barGrad = ctx.createLinearGradient(bx, by, bx, by + h)
      barGrad.addColorStop(0, '#38bdf8')
      barGrad.addColorStop(1, '#10b981')

      ctx.fillStyle = barGrad
      ctx.beginPath()
      ctx.roundRect(bx, by, barWidth, h, 4)
      ctx.fill()
    }

    texture.needsUpdate = true
  })

  // Click on 3D screen to toggle play or switch video
  const handleScreenClick = (e) => {
    e.stopPropagation()
    const video = videoElement || document.getElementById('cinema-active-video')
    if (video) {
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {})
      } else {
        video.pause()
        setIsPlaying(false)
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
        {videoTexture ? (
          <meshBasicMaterial
            map={videoTexture}
            toneMapped={false}
            side={THREE.FrontSide}
          />
        ) : (
          <meshBasicMaterial
            color="#080c14"
            side={THREE.FrontSide}
          />
        )}
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
