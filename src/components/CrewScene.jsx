import { useFrame } from '@react-three/fiber'
import { useScene } from '../context/SceneContext'

export function CrewScene() {
  const { earthRef, scrollProgress } = useScene()

  useFrame(() => {
    const t = scrollProgress.current

    // Only active during crew section: scrollProgress 2 → 3
    if (t < 2 || t > 3) return

    const p = t - 2 // local progress 0 → 1 within crew section

    if (!earthRef.current) return

    // Earth drifts further right as crew section progresses
    earthRef.current.position.x = 0.5 + p * 1.2

    // Earth shrinks slightly — pulling away from Earth narrative
    const scale = 1 - p * 0.18
    earthRef.current.scale.setScalar(scale)
  })

  return null
}