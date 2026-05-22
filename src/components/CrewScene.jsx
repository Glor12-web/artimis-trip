import { useFrame } from '@react-three/fiber'
import { useScene } from '../context/SceneContext'

export function CrewScene() {
  const { earthRef, scrollProgress } = useScene()

  useFrame(() => {
    const t = scrollProgress.current

    // Only active during crew section: scrollProgress 2.6 → 6.3
    if (t < 2.6 || t > 6.3) return

    const p = (t - 2.6) / 3.7 // local progress 0 → 1 within crew section

    if (!earthRef.current) return

    // Earth drifts further right as crew section progresses
    earthRef.current.position.x = 2.0 + p * 1.5

    // Earth shrinks slightly — pulling away from Earth narrative
    const scale = 0.6 - p * 0.1
    earthRef.current.scale.setScalar(scale)
  })

  return null
}