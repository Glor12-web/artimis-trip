import { createContext, useContext, useRef } from 'react'

const SceneContext = createContext(null)

export function SceneProvider({ children }) {
  // Shared refs — available to any scene section
  const earthRef = useRef(null)
  const cameraRef = useRef(null)
  const scrollProgress = useRef(0) // 0 → 1 as user scrolls

  const value = {
    earthRef,
    cameraRef,
    scrollProgress,
  }

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error('useScene must be used within SceneProvider')
  return ctx
}
