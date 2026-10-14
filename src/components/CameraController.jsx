import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/*
  CameraController:
  ─────────────────
  - Overview Mode: Camera orbits inside the auditorium with HARD BOUNDS
    * Camera position is clamped every frame to stay within theater walls
    * OrbitControls constrained with tight polar/azimuth angles
    * Never shows outside the theater — always interior view
  - Sitting Mode: Eye level in confirmed seat with head-look drag
    * Camera stays locked at seat position
    * Drag to look around (yaw/pitch clamped)

  Theater room bounds (from TheaterRoom.jsx):
    X walls: ±13.5
    Z rear:  13.2     Z front (screen): ~-14
    Y floor: 0        Y ceiling: ~11.5
*/

// Hard interior bounds — keep generous padding from the walls
const BOUNDS = {
  minX: -12.0,
  maxX: 12.0,
  minY: 1.2,
  maxY: 10.8,
  minZ: -12.5,
  maxZ: 12.5,
}

// Clamp a Vector3 inside the theater box
function clampInsideTheater(vec) {
  vec.x = THREE.MathUtils.clamp(vec.x, BOUNDS.minX, BOUNDS.maxX)
  vec.y = THREE.MathUtils.clamp(vec.y, BOUNDS.minY, BOUNDS.maxY)
  vec.z = THREE.MathUtils.clamp(vec.z, BOUNDS.minZ, BOUNDS.maxZ)
}

export default function CameraController({
  selectedSeat,
  confirmedSeat,
  isSittingView,
  onExitSitting,
}) {
  const { camera, gl } = useThree()
  const controlsRef = useRef()

  // Head look angles for sitting view (in radians)
  const headLook = useRef({
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
  })

  // Calculate camera overview parameters based on mobile viewport
  const getOverviewConfig = () => {
    const isMobilePortrait = typeof window !== 'undefined' && window.innerWidth < 768
    return {
      pos: isMobilePortrait ? { x: 0, y: 10.4, z: 12.4 } : { x: 0, y: 8.5, z: 12.2 },
      target: isMobilePortrait ? { x: 0, y: 2.6, z: -1.0 } : { x: 0, y: 2.8, z: -1.0 },
      fov: isMobilePortrait ? 68 : 52,
      sittingFov: isMobilePortrait ? 64 : 58,
    }
  }

  // Active seat for sitting
  const activeSeat = confirmedSeat || selectedSeat

  // Auto-adjust FOV on window resize / orientation change
  useEffect(() => {
    const handleResize = () => {
      if (!isSittingView) {
        const cfg = getOverviewConfig()
        camera.fov = cfg.fov
        camera.updateProjectionMatrix()
        if (controlsRef.current) {
          controlsRef.current.target.set(cfg.target.x, cfg.target.y, cfg.target.z)
        }
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSittingView, camera])

  // Handle Mode Transitions
  useEffect(() => {
    const cfg = getOverviewConfig()

    if (isSittingView && activeSeat) {
      // ─── TRANSITION TO FIRST-PERSON SEAT VIEW ───
      const [sx, sy, sz] = activeSeat.position
      const eyeY = sy + 0.95
      const eyeZ = sz - 0.05

      // Reset head look
      headLook.current.yaw = 0
      headLook.current.pitch = 0
      headLook.current.targetYaw = 0
      headLook.current.targetPitch = 0

      // Animate camera position smoothly into seat cushion
      gsap.to(camera.position, {
        x: sx,
        y: eyeY,
        z: eyeZ,
        duration: 2.0,
        ease: 'power3.inOut',
      })

      // Target the screen
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

      // Natural human sitting perspective FOV
      gsap.to(camera, {
        fov: cfg.sittingFov,
        duration: 1.5,
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    } else {
      // ─── TRANSITION TO OVERVIEW ───
      // Clamp the target overview position inside bounds
      const targetPos = { ...cfg.pos }
      targetPos.x = THREE.MathUtils.clamp(targetPos.x, BOUNDS.minX, BOUNDS.maxX)
      targetPos.y = THREE.MathUtils.clamp(targetPos.y, BOUNDS.minY, BOUNDS.maxY)
      targetPos.z = THREE.MathUtils.clamp(targetPos.z, BOUNDS.minZ, BOUNDS.maxZ)

      gsap.to(camera.position, {
        ...targetPos,
        duration: 1.8,
        ease: 'power3.inOut',
      })

      if (controlsRef.current) {
        controlsRef.current.enabled = true
        gsap.to(controlsRef.current.target, {
          ...cfg.target,
          duration: 1.8,
          ease: 'power3.inOut',
        })
      }

      gsap.to(camera, {
        fov: cfg.fov,
        duration: 1.5,
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    }
  }, [isSittingView, activeSeat, camera])

  // Pointer drag for head-look while sitting
  useEffect(() => {
    if (!isSittingView) return

    const dom = gl.domElement

    const onPointerDown = (e) => {
      headLook.current.isDragging = true
      headLook.current.startX = e.clientX
      headLook.current.startY = e.clientY
    }

    const onPointerMove = (e) => {
      if (!headLook.current.isDragging) return
      const dx = e.clientX - headLook.current.startX
      const dy = e.clientY - headLook.current.startY
      headLook.current.startX = e.clientX
      headLook.current.startY = e.clientY

      headLook.current.targetYaw -= dx * 0.003
      headLook.current.targetPitch -= dy * 0.0025

      headLook.current.targetYaw = THREE.MathUtils.clamp(
        headLook.current.targetYaw,
        -Math.PI * 0.45,
        Math.PI * 0.45
      )
      headLook.current.targetPitch = THREE.MathUtils.clamp(
        headLook.current.targetPitch,
        -Math.PI * 0.22,
        Math.PI * 0.25
      )
    }

    const onPointerUp = () => {
      headLook.current.isDragging = false
    }

    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isSittingView, gl.domElement])

  // ═══ EVERY FRAME: Clamp camera + orbit target inside theater bounds ═══
  useFrame(() => {
    if (isSittingView && activeSeat) {
      // ─── Sitting view: lock camera at seat, apply head look ───
      const [sx, sy, sz] = activeSeat.position
      const eyeY = sy + 0.95
      const eyeZ = sz - 0.05

      headLook.current.yaw += (headLook.current.targetYaw - headLook.current.yaw) * 0.08
      headLook.current.pitch += (headLook.current.targetPitch - headLook.current.pitch) * 0.08

      const dirToScreen = new THREE.Vector3(0 - sx, 4.5 - eyeY, -14 - eyeZ).normalize()
      const forward = dirToScreen.clone()

      forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), headLook.current.yaw)
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()
      forward.applyAxisAngle(right, headLook.current.pitch)

      const lookTarget = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).add(forward)
      camera.lookAt(lookTarget)
    } else {
      // ─── Overview mode: HARD CLAMP camera inside theater every frame ───
      clampInsideTheater(camera.position)

      // Also clamp the orbit target so the controls don't drift the view outside
      if (controlsRef.current) {
        clampInsideTheater(controlsRef.current.target)
      }
    }
  })

  const currentCfg = getOverviewConfig()

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isSittingView}
      enableDamping
      dampingFactor={0.06}
      /* Polar angle: prevent flipping under floor or above ceiling */
      maxPolarAngle={Math.PI / 2 + 0.15}
      minPolarAngle={0.2}
      /* Azimuth: limit horizontal rotation to ±70° so sides stay visible */
      minAzimuthAngle={-Math.PI * 0.38}
      maxAzimuthAngle={Math.PI * 0.38}
      /* Distance: tight range to keep camera inside the room */
      minDistance={3}
      maxDistance={18}
      /* Disable panning to prevent camera from flying off to the side */
      enablePan={false}
      target={[currentCfg.target.x, currentCfg.target.y, currentCfg.target.z]}
    />
  )
}
