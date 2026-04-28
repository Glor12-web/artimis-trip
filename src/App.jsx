import { SceneManager } from './components/SceneManager'
import { HeroOverlay } from './components/HeroOverlay'
import './index.css'

export default function App() {
  return (
    <div className="relative w-full" style={{ background: '#00000' }}>
      {/* Global Canvas — persists across all sections */}
      <SceneManager />

      {/* UI overlays — live above canvas in DOM */}
      <HeroOverlay />

      {/* Future sections mount here as DOM overlays */}
      {/* <MissionSection /> */}
      {/* <CrewSection /> */}
    </div>
  )
}
