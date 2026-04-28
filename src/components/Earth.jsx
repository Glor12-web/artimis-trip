import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { useScene } from '../context/SceneContext'

// We use procedural texture generation as fallback if CDN textures fail.
// For production, replace URLs with your own hosted textures.
const EARTH_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
const EARTH_NORMAL_URL  = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'
const EARTH_SPECULAR_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'

function ProceduralEarth({ meshRef }) {
  // Fallback: a blue-green sphere with noise shader feel
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        color="#1a6fa3"
        emissive="#0a2f4a"
        specular="#5faadb"
        shininess={30}
      />
    </mesh>
  )
}

function TexturedEarth({ meshRef }) {
  const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [
    EARTH_TEXTURE_URL,
    EARTH_NORMAL_URL,
    EARTH_SPECULAR_URL,
  ])

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        specular={new THREE.Color('#5faadb')}
        shininess={25}
      />
    </mesh>
  )
}

// Atmosphere glow using additive blending
function AtmosphereGlow() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.15, 64, 64]} />
      <meshPhongMaterial
        color="#3a8fd4"
        transparent
        opacity={0.08}
        side={THREE.FrontSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function AtmosphereRim() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <meshPhongMaterial
        color="#1a5fa0"
        transparent
        opacity={0.04}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export function Earth({ useTextures = true }) {
  const { earthRef, scrollProgress } = useScene()
  const localRef = useRef()
  const resolvedRef = earthRef || localRef

  // Floating animation state
  const floatOffset = useRef(0)

  useFrame((state, delta) => {
    if (!resolvedRef.current) return

    // Idle rotation
    resolvedRef.current.rotation.y += delta * 0.06

    // Subtle float
    floatOffset.current += delta * 0.4
    const baseY = 0
    const scrollY = scrollProgress.current * -0.8 // shifts down slightly on scroll
    resolvedRef.current.position.y =
      baseY + Math.sin(floatOffset.current) * 0.06 + scrollY

    // Parallax tilt on scroll
    resolvedRef.current.position.x = scrollProgress.current * 0.5
    resolvedRef.current.rotation.z = scrollProgress.current * 0.05
  })

  return (
    <group>
      {useTextures ? (
        <TexturedEarth meshRef={resolvedRef} />
      ) : (
        <ProceduralEarth meshRef={resolvedRef} />
      )}
      <AtmosphereGlow />
      <AtmosphereRim />
    </group>
  )
}
