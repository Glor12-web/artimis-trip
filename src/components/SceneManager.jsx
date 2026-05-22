import { CrewScene } from "./CrewScene";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { SceneProvider, useScene } from "../context/SceneContext";
import { MainScene } from "./MainScene";
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

function BlurController({ canvasContainerRef }) {
  const { scrollProgress } = useScene();

  useFrame(() => {
    const t = scrollProgress.current;
    if (canvasContainerRef.current) {
      // Blur starts after Journey section (t > 9)
      // Transition from 0 to 10px blur between t=9 and t=10
      let blurAmount = 0;
      if (t > 9) {
        blurAmount = Math.min((t - 9) * 10, 12); // Max 12px blur
      }
      canvasContainerRef.current.style.filter = `blur(${blurAmount}px)`;
    }
  });

  return null;
}

function CanvasContent({ canvasContainerRef }) {
  return (
    <>
      <ScrollTracker />
      <BlurController canvasContainerRef={canvasContainerRef} />
      {/* MainScene renders inside the global canvas */}
      <MainScene />
      {/* Future: <MissionScene />, <CrewScene />, etc. */}
      <CrewScene />
      {/* Future: <MissionScene />, <JourneyScene />, etc. */}
      <JourneyScene />
    </>
  );
}

export function SceneManager() {
  const canvasContainerRef = useRef(null);

  return (
    <SceneProvider>
      {/* Fixed canvas — stays in place while DOM sections scroll over it */}
      <div
        ref={canvasContainerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          transition: "filter 0.3s ease-out", // Smooth transition
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
          <CanvasContent canvasContainerRef={canvasContainerRef} />
        </Canvas>
      </div>
    </SceneProvider>
  );
}

