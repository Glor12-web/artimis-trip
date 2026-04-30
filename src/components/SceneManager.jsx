import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneProvider, useScene } from "../context/SceneContext";
import { HeroScene } from "./HeroScene";
import { JourneyScene } from "./JourneyScene";

// Scroll tracker — updates scrollProgress ref without causing re-renders
function ScrollTracker() {
  const { scrollProgress } = useScene();

  useEffect(() => {
    const handleScroll = () => {
      // Normalize scroll: 0 at top, 1 at 100vh scrolled
      const maxScroll = window.innerHeight;
      const current = window.scrollY / maxScroll;
      scrollProgress.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress]);

  return null;
}

function CanvasContent() {
  return (
    <>
      <ScrollTracker />
      {/* HeroScene renders inside the global canvas */}
      <HeroScene />
      <JourneyScene />
    </>
  );
}

export function SceneManager() {
  return (
    <SceneProvider>
      {/* Fixed canvas — stays in place while DOM sections scroll over it */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <Canvas
          camera={{ position: [0, 0.3, 6], fov: 50, near: 0.1, far: 500 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          style={{ background: "#000308" }}
        >
          <CanvasContent />
        </Canvas>
      </div>

      {/* Scroll spacer — creates scroll distance for GSAP/scroll reactions */}
      <div
        style={{
          height: "600vh",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </SceneProvider>
  );
}
