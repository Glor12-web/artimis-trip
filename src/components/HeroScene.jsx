import { useRef, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { Earth } from './Earth'
import { useScene } from '../context/SceneContext'

// Camera controller — reads scrollProgress and smoothly moves camera
function CameraController() {
  const { camera } = useThree()
  const { scrollProgress, cameraRef } = useScene()

  cameraRef.current = camera

  useFrame(() => {
    const t = scrollProgress.current

    // Section 1: Hero (t = 0 → 1) — camera zooms toward Earth
    if (t <= 1) {
      camera.position.z += (6 + (3.5 - 6) * t - camera.position.z) * 0.05
      camera.position.y += (0.3 + (0.8 - 0.3) * t - camera.position.y) * 0.05
      camera.position.x += (0 - camera.position.x) * 0.05
    }

    // Section 2: Mission Overview (t = 1 → 2) — continues zooming in
    else if (t <= 2) {
      const p = t - 1  // local progress 0 → 1 within this section
      camera.position.z += (3.5 + (2.5 - 3.5) * p - camera.position.z) * 0.05
      camera.position.y += (0.8 - camera.position.y) * 0.05
      camera.position.x += (0 - camera.position.x) * 0.05
    }

    // Section 3: Crew (t = 2 → 3) — camera holds, slight drift up
    else if (t <= 3) {
      const p = t - 2
      camera.position.z += (2.5 - camera.position.z) * 0.05
      camera.position.y += (0.8 + p * 0.3 - camera.position.y) * 0.05
    }

    // Section 4: Journey Timeline (t = 3 → 4) — pulls back to show journey
    else if (t <= 4) {
      const p = t - 3
      camera.position.z += (2.5 + (5 - 2.5) * p - camera.position.z) * 0.05
      camera.position.y += (1.1 - camera.position.y) * 0.05
    }

    // Section 5: Moon Encounter (t = 4 → 5) — shifts toward Moon
    else if (t <= 5) {
      const p = t - 4
      camera.position.z += (5 - camera.position.z) * 0.05
      camera.position.x += (p * 2 - camera.position.x) * 0.05
    }

    // Section 6: Return to Earth (t = 5 → 6) — drifts back
    else if (t <= 6) {
      const p = t - 5
      camera.position.x += ((1 - p) * 2 - camera.position.x) * 0.05
      camera.position.z += (5 + (4 - 5) * p - camera.position.z) * 0.05
    }

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
