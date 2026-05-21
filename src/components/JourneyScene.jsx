import React, { useRef, Suspense, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../context/SceneContext';

const MOON_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg';

function Rocket() {
  const rocketTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, 128, 128);
    // Add vertical panels/lines
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 4;
    for (let i = 0; i < 128; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke();
    }
    // Add a signature orange ring at the bottom
    ctx.fillStyle = '#ff7b00';
    ctx.fillRect(0, 100, 128, 28);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <group>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 5, 32]} />
        <meshStandardMaterial map={rocketTex} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Capsule() {
  const thermalTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ced4da'; // light grey metallic
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12); // Tiling the panels
    return tex;
  }, []);

  const solarTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a2463';
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = '#3e92cc';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 16, 16);
    ctx.strokeRect(16, 16, 16, 16);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 1);
    return tex;
  }, []);

  return (
    <group>
      {/* Orion Crew Module */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[1, 1, 32]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Service Module with thermal/panel texture */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial map={thermalTex} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Solar Panels */}
      <mesh position={[2, -0.5, 0]}>
        <boxGeometry args={[3, 0.1, 0.5]} />
        <meshStandardMaterial map={solarTex} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-2, -0.5, 0]}>
        <boxGeometry args={[3, 0.1, 0.5]} />
        <meshStandardMaterial map={solarTex} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function TexturedMoon() {
  const colorMap = useLoader(THREE.TextureLoader, MOON_TEXTURE_URL);
  return <meshStandardMaterial map={colorMap} roughness={0.9} metalness={0.1} />;
}

export function JourneyScene() {
  const { earthRef, scrollProgress } = useScene();
  const { camera } = useThree();

  const slsGroup = useRef();
  const orionGroup = useRef();
  const moonRef = useRef();
  const heatShieldRef = useRef();

  const baseCameraZ = 3.5;
  const baseCameraY = 0.8;

  // The seamless trajectory path
  const trajectoryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),       // 0: Transition from SLS seamlessly
      new THREE.Vector3(2.5, 0.5, -2),    // 1: Fly towards moon right
      new THREE.Vector3(5, 0, -6),        // 2: Beside Moon Right (wider turn)
      new THREE.Vector3(0, 0, -10),       // 3: Behind Moon
      new THREE.Vector3(-5, 0, -6),       // 4: Beside Moon Left (wider turn)
      new THREE.Vector3(0, 0, -2.5),      // 5: Crossing FRONT of Moon! (Visible)
      new THREE.Vector3(-2.5, -0.5, -1),  // 6: Returning to Earth
      new THREE.Vector3(0, -2, 0),        // 7: Reentry Splashdown
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    const raw = scrollProgress.current;
    if (raw <= 1) {
      if (slsGroup.current) slsGroup.current.visible = false;
      if (orionGroup.current) orionGroup.current.visible = false;
      if (moonRef.current) moonRef.current.visible = false;
      return;
    }

    if (!earthRef.current) return;

    if (slsGroup.current) slsGroup.current.visible = true;
    if (orionGroup.current) orionGroup.current.visible = true;
    if (moonRef.current) moonRef.current.visible = true;

    // Default targets
    let targetEarthScale = 1.0;
    let targetEarthX = 0;
    let targetEarthY = -1.5;
    let targetEarthZ = 0;

    let targetCamX = 0;
    let targetCamY = baseCameraY;
    let targetCamZ = baseCameraZ;
    let targetCamRotX = 0;

    // SLS 
    let targetSlsY = -1;
    let targetSlsScale = 0.2;
    let slsVisible = false;

    // Orion
    let targetOrionX = 0;
    let targetOrionY = 0;
    let targetOrionZ = 0;
    let targetOrionLookTarget = null;
    let orionVisible = false;
    let glowOpacity = 0;

    // Moon
    let targetMoonScale = 0;
    let targetMoonX = 0;
    let targetMoonY = 0;
    let targetMoonZ = -6;

    // Phase 1 (Launch): 1 -> 2
    if (raw > 1 && raw <= 2) {
      const t = Math.max(0, Math.min((raw - 1), 1)); // 0 -> 1
      slsVisible = true;
      orionVisible = false;
      targetEarthX = 0;

      // SLS climbs from -0.5 to exactly 1.5, seamlessly matching Trajectory Point 0!
      targetSlsY = -0.5 + (t * 2.0);
      targetSlsScale = 0.2;

      targetCamY = baseCameraY + (t * 1.5);
      targetCamRotX = t * 0.2;
      targetCamZ = baseCameraZ + (t * 1.0); // Slight camera pull back
    }
    // Phase 2 (Lunar Flyby & Moon Crossing): 2 -> 3
    else if (raw > 2 && raw <= 3) {
      const t = Math.max(0, Math.min((raw - 2), 1)); // 0 -> 1
      const curve_t = t * 0.73; // 0.0 -> 0.73 (Flies out, behind moon, and crosses the FRONT)

      slsVisible = false; // SLS is gone, Orion takes over!
      orionVisible = true;

      targetMoonScale = t * 1.5;

      const targetPos = trajectoryCurve.getPoint(curve_t);
      const tangent = trajectoryCurve.getTangent(curve_t);

      targetOrionX = targetPos.x;
      targetOrionY = targetPos.y;
      targetOrionZ = targetPos.z;
      targetOrionLookTarget = targetPos.clone().add(tangent);

      targetEarthScale = 1.0;
      targetEarthX = 0;
      targetEarthZ = 0;
      targetEarthY = -1.5 - (t * 0.2); // Drift down slightly

      targetCamZ = baseCameraZ + 1.0 + (t * 2); // Camera pulls back safely
    }
    // Phase 3 (Return to Earth): 3 -> 4
    else if (raw > 3) {
      const t = Math.max(0, Math.min((raw - 3), 1)); // 0 -> 1

      // Accelerate the timeline slightly so splashdown finishes before the absolute end of the scroll
      const fast_t = Math.min(t * 1.25, 1.0); // Completes at 80% scroll

      const curve_t = 0.73 + (fast_t * 0.27); // 0.73 -> 1.0 (Returns to Earth)

      slsVisible = false;
      orionVisible = true;

      // Stop zooming the moon: gradually shrink it away as we leave lunar orbit
      targetMoonScale = 1.5 - (fast_t * 1.5);

      // Smooth descent curve translation
      const targetPos = trajectoryCurve.getPoint(curve_t);
      const tangent = trajectoryCurve.getTangent(curve_t);

      targetOrionX = targetPos.x;
      targetOrionY = targetPos.y;
      targetOrionZ = targetPos.z;

      // Force Orion to physically dip into the Earth/Ocean at the very end of its fast_t cycle
      if (fast_t > 0.9) {
        targetOrionY -= (fast_t - 0.9) * 8;
      }

      if (fast_t > 0.5) {
        // Spin around 180 degrees to point the heat shield towards Earth atmosphere
        targetOrionLookTarget = targetPos.clone().sub(tangent);
      } else {
        targetOrionLookTarget = targetPos.clone().add(tangent);
      }

      // Heat shield glow intensity builds drastically at the very end
      glowOpacity = (fast_t > 0.7) ? (fast_t - 0.7) * 5 : 0;

      // Let Earth grow slightly to simulate an intense zoom-in effect
      targetEarthScale = 1.0 + (fast_t * 0.15); // Scales from 1.0 to 1.15
      targetEarthX = 0;
      targetEarthZ = 0;

      // Pull Earth dramatically into the center of the viewport
      targetEarthY = -1.7 + (fast_t * 1.7); // Rises to Y=0

      // Zoom the camera significantly into Earth's atmosphere showing Orion entering
      targetCamZ = baseCameraZ + 3.0 - (fast_t * 4.0); // Pushes from Z=6.5 down to Z=2.5
      targetCamY = baseCameraY - (fast_t * 0.8);       // Centers camera Vertically on Earth
    }

    // Apply values with smooth lerp
    if (slsGroup.current) {
      slsGroup.current.visible = slsVisible;
      slsGroup.current.position.y += (targetSlsY - slsGroup.current.position.y) * 0.1;
      slsGroup.current.scale.setScalar(targetSlsScale);
    }

    if (orionGroup.current) {
      orionGroup.current.visible = orionVisible;
      orionGroup.current.position.x += (targetOrionX - orionGroup.current.position.x) * 0.1;
      orionGroup.current.position.y += (targetOrionY - orionGroup.current.position.y) * 0.1;
      orionGroup.current.position.z += (targetOrionZ - orionGroup.current.position.z) * 0.1;

      if (targetOrionLookTarget) {
        const dummy = new THREE.Object3D();
        dummy.position.copy(orionGroup.current.position);
        dummy.lookAt(targetOrionLookTarget);
        orionGroup.current.quaternion.slerp(dummy.quaternion, 0.08); // Even smoother rotation
      }

      if (heatShieldRef.current) {
        heatShieldRef.current.opacity += (glowOpacity - heatShieldRef.current.opacity) * 0.04;
        heatShieldRef.current.emissiveIntensity = heatShieldRef.current.opacity * 2;
      }
    }

    if (moonRef.current) {
      const currentScale = moonRef.current.scale.x;
      const nextScale = currentScale + (targetMoonScale - currentScale) * 0.04;
      moonRef.current.scale.setScalar(Math.max(0.001, nextScale));
      moonRef.current.position.set(targetMoonX, targetMoonY, targetMoonZ);
    }

    earthRef.current.position.x += (targetEarthX - earthRef.current.position.x) * 0.04;
    earthRef.current.position.y += (targetEarthY - earthRef.current.position.y) * 0.04;
    earthRef.current.position.z += (targetEarthZ - earthRef.current.position.z) * 0.04;
    earthRef.current.scale.setScalar(targetEarthScale);

    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.position.z += (targetCamZ - camera.position.z) * 0.04;
    camera.rotation.x += (targetCamRotX - camera.rotation.x) * 0.04;
  });

  return (
    <group>
      {/* Launch Vehicle */}
      <group ref={slsGroup} visible={false}>
        <Suspense fallback={null}>
          <Rocket />
          <pointLight position={[0, -2, 0]} color="#ffaa00" intensity={5} distance={10} />
        </Suspense>
      </group>

      {/* Orion Capsule */}
      <group ref={orionGroup} visible={false}>
        {/* Rotate so local Z+ points towards front of the capsule (Y+ on the model) */}
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.3}>
          <Suspense fallback={null}>
            <Capsule />
            <mesh position={[0, -1, 0]}>
              <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
              <meshStandardMaterial
                ref={heatShieldRef}
                color="#ff4500"
                emissive="#ff4500"
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Suspense>
        </group>
      </group>

      {/* Stand-in Moon */}
      <mesh ref={moonRef} visible={false}>
        <sphereGeometry args={[1, 64, 64]} />
        <Suspense fallback={<meshStandardMaterial color="#cccccc" roughness={0.8} />}>
          <TexturedMoon />
        </Suspense>
      </mesh>
    </group>
  );
}
