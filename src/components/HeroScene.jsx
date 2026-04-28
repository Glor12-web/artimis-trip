import { useRef, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { Earth } from './Earth'
import { useScene } from '../context/SceneContext'

// Camera controller — reads scrollProgress and smoothly moves camera
function CameraController() {
  const { camera } = useThree()
  const { scrollProgress, cameraRef } = useScene()

  // Store camera ref for external access if needed
  cameraRef.current = camera

  // Hero start: z=6, on scroll moves to z=3.5 (zoom in)
  const CAM_START_Z = 6
  const CAM_END_Z   = 3.5
  const CAM_START_Y = 0.3
  const CAM_END_Y   = 0.8

  useFrame(() => {
    const t = scrollProgress.current
    const targetZ = CAM_START_Z + (CAM_END_Z - CAM_START_Z) * t
    const targetY = CAM_START_Y + (CAM_END_Y - CAM_START_Y) * t

    // Smooth lerp — feels cinematic, not snappy
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Moon — small, distant, subtle
function Moon() {
  const moonRef = useRef()
  useFrame(({ clock }) => {
    if (!moonRef.current) return
    const t = clock.getElapsedTime()
    moonRef.current.position.x = Math.cos(t * 0.08) * 5
    moonRef.current.position.z = Math.sin(t * 0.08) * 3 - 1
    moonRef.current.position.y = Math.sin(t * 0.04) * 0.5
    moonRef.current.rotation.y += 0.002
  })

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color="#c8bfa0" roughness={0.9} metalness={0.0} />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <>
      {/* Camera */}
      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.12} color="#3a5a8a" />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.2}
        color="#ffffff"
        castShadow={false}
      />
      {/* Rim light — gives Earth a subtle blue backlight */}
      <directionalLight
        position={[-4, -1, -3]}
        intensity={0.3}
        color="#3a8fd4"
      />
      {/* Warm accent — simulates solar reflection */}
      <pointLight position={[8, 2, 2]} intensity={0.5} color="#ffd070" />

      {/* Stars background */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={3}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* Earth — Suspense for texture loading */}
      <Suspense fallback={<Earth useTextures={false} />}>
        <Earth useTextures={true} />
      </Suspense>

      {/* Moon — orbiting in background */}
      <Moon />
    </>
  )
}
