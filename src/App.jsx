import { SceneManager } from "./components/SceneManager";
import { JourneyOverlay } from "./components/JourneyOverlay";
import { FuturisticFooter } from './components/FuturisticFooter'
import { HeroOverlay } from "./components/HeroOverlay";
import { MissionOverlay } from "./components/MissionOverlay";
import { MoonEncounter } from "./components/MoonEncounter";
import { ReturnToEarth } from "./components/ReturnToEarth";
import { CrewOverlay } from "./components/CrewOverlay";
import { MissionPrologue } from "./components/MissionPrologue";
import "./index.css";

function NarrativeSection({ title, text, height = "50vh" }) {
  return (
    <div style={{ 
      height, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0 10vw', 
      position: 'relative', 
      zIndex: 10,
      textAlign: 'center'
    }}>
      <h3 style={{ 
        fontFamily: "'DM Mono', monospace", 
        fontSize: '11px', 
        color: '#4fc3f7', 
        letterSpacing: '0.25em', 
        textTransform: 'uppercase',
        marginBottom: '20px',
        opacity: 0.8
      }}>
        {title}
      </h3>
      <p style={{ 
        fontFamily: "'Cormorant Garamond', serif", 
        fontSize: 'clamp(20px, 3vw, 32px)', 
        lineHeight: 1.4, 
        color: 'rgba(255,255,255,0.9)', 
        fontWeight: 300,
        maxWidth: '700px'
      }}>
        {text}
      </p>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative w-full" style={{ background: "#000308" }}>
      {/* Canvas — fixed, never unmounts, runs the whole time */}
      <SceneManager />
      
      <HeroOverlay />
      
      <MissionPrologue />
      
      <MissionOverlay />

      <NarrativeSection 
        title="The Ambassadors" 
        text="Four individuals have been chosen to represent all of humanity. They are not just astronauts; they are the eyes and ears of a new generation of explorers."
      />
      
      <CrewOverlay />

      <NarrativeSection 
        title="The Voyage" 
        text="The path is set. A 10-day journey across the cosmic void, pushing the boundaries of what is possible for our species."
      />

      <JourneyOverlay />
      <MoonEncounter />
      <ReturnToEarth />
      <FuturisticFooter />
    </div>
  );
}
