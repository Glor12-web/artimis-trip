import { SceneManager } from './components/SceneManager'
import { HeroOverlay } from './components/HeroOverlay'
import { JourneyOverlay } from './components/JourneyOverlay'
import './index.css'

export default function App() {
  return (
    <div className="relative w-full" style={{ background: '#000000' }}>
      {/* Global Canvas — persists across all sections */}
      <SceneManager />

      {/* UI overlays — live above canvas in DOM */}
      <HeroOverlay />
      <JourneyOverlay />
      {/* Future sections mount here as DOM overlays */}
      {/* <MissionSection /> */}
      {/* <CrewSection /> */}
    </div>
  )
}
