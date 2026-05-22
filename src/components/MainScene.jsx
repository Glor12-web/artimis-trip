import { useRef, Suspense } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Earth } from "./Earth";
import { useScene } from "../context/SceneContext";

// Camera controller — reads scrollProgress and smoothly moves camera
function CameraController() {
  const { camera } = useThree();
  const { scrollProgress, cameraRef } = useScene();

  cameraRef.current = camera;

  useFrame(() => {
    const t = scrollProgress.current;

    // Section 1: Hero (t = 0 → 1) — camera zooms toward Earth
    if (t <= 1) {
      camera.position.z += (6 + (3.5 - 6) * t - camera.position.z) * 0.05;
      camera.position.y += (0.3 + (0.8 - 0.3) * t - camera.position.y) * 0.05;
      camera.position.x += (0 - camera.position.x) * 0.05;
    }

    // Section 2: Mission Overview (t = 1 → 2.6) — continues zooming in
    else if (t <= 2.6) {
      const p = (t - 1) / 1.6; // local progress
      camera.position.z += (3.5 + (2.5 - 3.5) * p - camera.position.z) * 0.05;
      camera.position.y += (0.8 - camera.position.y) * 0.05;
      camera.position.x += (0 - camera.position.x) * 0.05;
    }

    // Section 3: Crew (t = 2.6 → 6.3) — camera holds, slight drift up
    else if (t <= 6.3) {
      const p = (t - 2.6) / 3.7; 
      camera.position.z += (2.5 - camera.position.z) * 0.05;
      camera.position.y += (0.8 + p * 0.3 - camera.position.y) * 0.05;
    }

    // Section 4: Journey Timeline (t = 6.3 → 9.8) — pulls back to show journey
    else if (t <= 9.8) {
      const p = (t - 6.3) / 3.5;
      camera.position.z += (2.5 + (5 - 2.5) * p - camera.position.z) * 0.05;
      camera.position.y += (1.1 - camera.position.y) * 0.05;
    }

    // Section 5: Moon Encounter (t = 9.8 → 10.8) — shifts toward Moon
    else if (t <= 10.8) {
      const p = t - 9.8;
      camera.position.z += (5 - camera.position.z) * 0.05;
      camera.position.x += (p * 2 - camera.position.x) * 0.05;
    }

    // Section 6: Return to Earth (t = 10.8 → 14.8) — drifts back
    else if (t <= 14.8) {
      const p = (t - 10.8) / 4;
      camera.position.x += ((1 - p) * 2 - camera.position.x) * 0.05;
      camera.position.z += (5 + (4 - 5) * p - camera.position.z) * 0.05;
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Textured Moon component to match JourneyScene
function TexturedMoonMaterial() {
  const moonTexture = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg",
  );
  return (
    <meshStandardMaterial map={moonTexture} roughness={0.9} metalness={0.0} />
  );
}

// Moon — small, distant, subtle
function Moon() {
  const moonRef = useRef();
  const { scrollProgress } = useScene();

  useFrame(({ clock }) => {
    if (!moonRef.current) return;
    const t = clock.getElapsedTime();
    const raw = scrollProgress.current;

    // Hide moon during Journey phase (>6)
    moonRef.current.visible = raw <= 6;

    moonRef.current.position.x = Math.cos(t * 0.08) * 5;
    moonRef.current.position.z = Math.sin(t * 0.08) * 3 - 1;
    moonRef.current.position.y = Math.sin(t * 0.04) * 0.5;
    moonRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <Suspense
        fallback={<meshStandardMaterial color="#c8bfa0" roughness={0.9} />}
      >
        <TexturedMoonMaterial />
      </Suspense>
    </mesh>
  );
}

export function MainScene() {
  const { earthRef, scrollProgress } = useScene();
  const moonRef = useRef();

  useFrame((state, delta) => {
    const t = scrollProgress.current;
    if (!earthRef.current) return;

    // Visibility & Positioning Logic
    // Section 1: Hero (0-1)
    // Section 2: Mission (1-2.6)
    // Section 3: Crew (2.6-6.3)
    // Section 4: Journey (6.3-14)
    
    if (t <= 1) {
      earthRef.current.visible = true;
      earthRef.current.position.x = t * 0.2;
      earthRef.current.position.y = t * -0.5;
      earthRef.current.scale.setScalar(1);
    } 
    else if (t > 1 && t <= 2.6) {
      const p = (t - 1) / 1.6;
      earthRef.current.visible = true;
      earthRef.current.scale.setScalar(1 - p * 0.4); 
      earthRef.current.position.y = -0.5 - p * 1.0; 
      earthRef.current.position.x = 0.2 + p * 1.5;   
    }
    else if (t > 2.6 && t <= 6.3) {
      earthRef.current.visible = true;
    }
    else {
      // JourneyScene takes over visibility and positioning after t=6.3
    }
    
    // Moon visibility logic
    if (moonRef.current) {
      if (t <= 6.3) {
        moonRef.current.visible = true;
        if (t > 1 && t <= 2.6) {
          const p = (t - 1) / 1.6;
          moonRef.current.scale.setScalar(1 - p * 0.5);
        }
      } else {
        moonRef.current.visible = false;
      }
    }
  });

  useFrame(({ clock }) => {
    if (!moonRef.current) return;
    const t = clock.getElapsedTime();
    
    moonRef.current.position.x = Math.cos(t * 0.08) * 5;
    moonRef.current.position.z = Math.sin(t * 0.08) * 3 - 1;
    moonRef.current.position.y = Math.sin(t * 0.04) * 0.5;
    moonRef.current.rotation.y += 0.002;
  });

  return (
    <>
      {/* Camera */}
      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.12} color="#3a5a8a" />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.2}
        color="#ffffff"
        castShadow={false}
      />
      {/* Rim light — gives Earth a subtle blue backlight */}
      <directionalLight
        position={[-4, -1, -3]}
        intensity={0.3}
        color="#3a8fd4"
      />
      {/* Warm accent — simulates solar reflection */}
      <pointLight position={[8, 2, 2]} intensity={0.5} color="#ffd070" />

      {/* Stars background */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={3}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* Earth — Suspense for texture loading */}
      <Suspense fallback={<Earth useTextures={false} />}>
        <Earth useTextures={true} />
      </Suspense>

      {/* Moon — orbiting in background */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <Suspense
          fallback={<meshStandardMaterial color="#c8bfa0" roughness={0.9} />}
        >
          <TexturedMoonMaterial />
        </Suspense>
      </mesh>
    </>
  );
}
