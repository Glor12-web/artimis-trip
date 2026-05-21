import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneProvider, useScene } from '../context/SceneContext'
import { HeroScene } from './HeroScene'
import { CrewScene } from './CrewScene'

// Scroll tracker — updates scrollProgress ref without causing re-renders
function ScrollTracker() {
  const { scrollProgress } = useScene()

  useEffect(() => {
    const handleScroll = () => {
      // No cap — grows as user scrolls: 0, 1, 2, 3... one per section
      const current = window.scrollY / window.innerHeight
      scrollProgress.current = current
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollProgress])

  return null
}

function CanvasContent() {
  return (
    <>
      <ScrollTracker />
      {/* HeroScene renders inside the global canvas */}
      <HeroScene />
      {/* Future: <MissionScene />, <CrewScene />, etc. */}
      <CrewScene />
      {/* Future: <MissionScene />, <JourneyScene />, etc. */}
    </>
  )
}

export function SceneManager() {
  return (
    <SceneProvider>
      {/* Fixed canvas — stays in place while DOM sections scroll over it */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      >
        <Canvas
          camera={{ position: [0, 0.3, 6], fov: 50, near: 0.1, far: 500 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: '#000308' }}
        >
          <CanvasContent />
        </Canvas>
      </div>

      {/* Scroll spacer — creates scroll distance for GSAP/scroll reactions */}
      {/* Each section adds height here, DOM overlays use position:sticky */}
      {/*
  SCROLL SPACER — increase this number to add more scroll room.
  Each section = 150vh.
  Section 1 Hero:            scrollProgress 0 → 1
  Section 2 Mission:         scrollProgress 1 → 2
  Section 3 Moon Encounter:  scrollProgress 2 → 3
  Section 4 Return to Earth: scrollProgress 3 → 4
*/}
      <div style={{ height: '1050vh', position: 'relative', zIndex: 1, pointerEvents: 'none' }} />
    </SceneProvider>
  )
}
