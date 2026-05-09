import { SceneManager } from './components/SceneManager'
import { HeroOverlay } from './components/HeroOverlay'
import { MoonEncounter } from './components/MoonEncounter'
import './index.css'

export default function App() {
  return (
    <div className="relative w-full min-h-[300vh] bg-black">   
     <SceneManager />
      <HeroOverlay />
      <MoonEncounter />
    </div>
  )
}