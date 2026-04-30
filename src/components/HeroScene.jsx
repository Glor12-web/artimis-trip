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

  const CAM_START_Z = 6; 
  const CAM_END_Z = 3.5;
  const CAM_START_Y = 0.3;
  const CAM_END_Y = 0.8;

  useFrame(() => {
    const t = scrollProgress.current;

    if (t > 1) return;

    const targetZ = CAM_START_Z + (CAM_END_Z - CAM_START_Z) * t;
    const targetY = CAM_START_Y + (CAM_END_Y - CAM_START_Y) * t;

    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Textured Moon component to match JourneyScene
function TexturedMoonMaterial() {
  const moonTexture = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg"
  );
  return <meshStandardMaterial map={moonTexture} roughness={0.9} metalness={0.0} />;
}

// Moon — small, distant, subtle
function Moon() {
  const moonRef = useRef();
  const { scrollProgress } = useScene();

  useFrame(({ clock }) => {
    if (!moonRef.current) return;
    const t = clock.getElapsedTime();
    const raw = scrollProgress.current;

    // Hide moon during Journey phase (>1)
    moonRef.current.visible = raw <= 1;

    moonRef.current.position.x = Math.cos(t * 0.08) * 5;
    moonRef.current.position.z = Math.sin(t * 0.08) * 3 - 1;
    moonRef.current.position.y = Math.sin(t * 0.04) * 0.5;
    moonRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <Suspense fallback={<meshStandardMaterial color="#c8bfa0" roughness={0.9} />}>
        <TexturedMoonMaterial />
      </Suspense>
    </mesh>
  );
}

export function HeroScene() {
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
      <Moon />
    </>
  );
}
