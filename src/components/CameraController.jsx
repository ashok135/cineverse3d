import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

/*
  CameraController:
  - Overview Mode: Camera placed inside the auditorium volume looking down at seats & screen
    * OrbitControls constrained inside room bounds so camera never clips outside
    * Smooth GSAP transitions
  - Sitting Mode: Eye level in confirmed seat facing the movie screen with head look
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

  // Calculate camera overview parameters based on mobile viewport
  const getOverviewConfig = () => {
    const isMobilePortrait = typeof window !== 'undefined' && window.innerWidth < 768
    return {
      pos: isMobilePortrait ? { x: 0, y: 10.2, z: 14.8 } : { x: 0, y: 7.5, z: 10.5 },
      target: isMobilePortrait ? { x: 0, y: 1.8, z: -2.0 } : { x: 0, y: 2.0, z: -3.5 },
      fov: isMobilePortrait ? 66 : 50,
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
      gsap.to(camera.position, {
        ...cfg.pos,
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

  // Update sitting head orientation each frame
  useFrame(() => {
    if (!isSittingView || !activeSeat) return

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
  })

  const currentCfg = getOverviewConfig()

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isSittingView}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.08}
      minPolarAngle={0.25}
      minDistance={3}
      maxDistance={22}
      target={[currentCfg.target.x, currentCfg.target.y, currentCfg.target.z]}
    />
  )
}
