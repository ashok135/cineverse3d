import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/*
  CameraController supports two distinct modes:

  1. OVERVIEW MODE (Selecting / Browsing):
     - Wide cinematic overview of the entire theater
     - Free orbit, zoom, pan with OrbitControls
     - Highlights selected seat

  2. SITTING MODE (After Confirmation):
     - Camera placed exactly at eye level in the confirmed seat:
       x = seat.x, y = seat.y + 0.95, z = seat.z - 0.05
     - Camera looks directly forward at the movie screen (z = -14)
     - Restricted First-Person Head Look (yaw ±70°, pitch ±35°)
       so you can look around the auditorium from your actual seat
       without leaving the chair!
     - Row A: Giant towering screen close-up view
     - Row J: Distant balcony overview looking down at all 9 rows
*/

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

  // Overview camera defaults
  const overviewPos = { x: 0, y: 10, z: 14 }
  const overviewTarget = { x: 0, y: 1.5, z: -4 }

  // Active seat for sitting
  const activeSeat = confirmedSeat || selectedSeat

  // Handle Mode Transitions
  useEffect(() => {
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

      // Slightly increase FOV to 58 for natural human sitting perspective
      gsap.to(camera, {
        fov: 58,
        duration: 1.5,
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    } else {
      // ─── TRANSITION TO OVERVIEW ───
      gsap.to(camera.position, {
        ...overviewPos,
        duration: 1.8,
        ease: 'power3.inOut',
      })

      if (controlsRef.current) {
        controlsRef.current.enabled = true
        gsap.to(controlsRef.current.target, {
          ...overviewTarget,
          duration: 1.8,
          ease: 'power3.inOut',
        })
      }

      gsap.to(camera, {
        fov: 50,
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

      // Convert to yaw and pitch with damping
      headLook.current.targetYaw -= dx * 0.003
      headLook.current.targetPitch -= dy * 0.0025

      // Clamps: human neck limits
      headLook.current.targetYaw = THREE.MathUtils.clamp(
        headLook.current.targetYaw,
        -Math.PI * 0.45, // ~80 degrees left
        Math.PI * 0.45   // ~80 degrees right
      )
      headLook.current.targetPitch = THREE.MathUtils.clamp(
        headLook.current.targetPitch,
        -Math.PI * 0.22, // look down ~40 degrees
        Math.PI * 0.25   // look up ~45 degrees
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

  // Update sitting head orientation each frame
  useFrame(() => {
    if (!isSittingView || !activeSeat) return

    const [sx, sy, sz] = activeSeat.position
    const eyeY = sy + 0.95
    const eyeZ = sz - 0.05

    // Smooth lerp for head look
    headLook.current.yaw += (headLook.current.targetYaw - headLook.current.yaw) * 0.08
    headLook.current.pitch += (headLook.current.targetPitch - headLook.current.pitch) * 0.08

    // Screen is at [0, 4.5, -14]. Base view vector points towards screen:
    // Screen direction vector from seat:
    const dirToScreen = new THREE.Vector3(0 - sx, 4.5 - eyeY, -14 - eyeZ).normalize()

    // Apply pitch and yaw relative to screen direction
    const forward = dirToScreen.clone()

    // Yaw rotation around Y axis
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), headLook.current.yaw)

    // Pitch rotation around right vector
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()
    forward.applyAxisAngle(right, headLook.current.pitch)

    const lookTarget = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).add(forward)
    camera.lookAt(lookTarget)
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isSittingView}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minPolarAngle={0.2}
      minDistance={3}
      maxDistance={28}
      target={[overviewTarget.x, overviewTarget.y, overviewTarget.z]}
    />
  )
}
