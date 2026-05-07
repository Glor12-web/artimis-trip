import { SceneManager } from './components/SceneManager'
import { HeroOverlay } from './components/HeroOverlay'
import { MissionOverlay } from './components/MissionOverlay'
import { ReturnToEarth} from './components/ReturnToEarth'
import './index.css'

/*
  HOW TO ADD A NEW SECTION 

  1. Create a new file in src/components/ — copy MissionOverlay.jsx as your template
  2. Change the section number in the badge, the heading, and the content
  3. Import it here
  4. Add it below in order — the order here is the order on screen
  5. If you need more scroll room, go to SceneManager.jsx and increase the
     height on the scroll spacer div (currently 1000vh)

  That is all. The Canvas, camera, Earth, and stars are already running.
  You are just adding DOM content that scrolls over them.
*/

export default function App() {
  return (
    <div className="relative w-full" style={{ background: '#000308' }}>

      {/* Canvas — fixed, never unmounts, runs the whole time */}
      <SceneManager />

      {/* Sections — scroll over the canvas in this order */}
      <HeroOverlay />     {/* scrollProgress 0 → 1 */}
      <MissionOverlay />  {/* scrollProgress 1 → 2 */}
      <ReturnToEarth />  {/* scrollProgress 1 → 2 */}
      {/* Next teammate adds their section here */}

    </div>
  )
}