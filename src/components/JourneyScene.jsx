import React, { useRef, Suspense, useMemo } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useScene } from '../context/SceneContext';

const MOON_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg';

function Rocket() {
  const { scrollProgress } = useScene();
  const flameRef = useRef();
  
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

  useFrame((state) => {
    if (flameRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1 + Math.sin(t * 30) * 0.1;
      flameRef.current.scale.set(s, 1.5 + Math.sin(t * 20) * 0.5, s);
    }
  });

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
      
      {/* Exhaust Flame */}
      <group position={[0, 0, 0]} ref={flameRef}>
        <mesh position={[0, -1, 0]}>
          <coneGeometry args={[0.4, 3, 16]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
        </mesh>
        <pointLight position={[0, -1, 0]} color="#ffaa00" intensity={10} distance={15} />
      </group>
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
  const { earthRef, moonRef, scrollProgress } = useScene();
  const { camera } = useThree();

  const slsGroup = useRef();
  const orionGroup = useRef();
  const heatShieldRef = useRef();

  const baseCameraZ = 3.5;
  const baseCameraY = 0.8;

  // The seamless trajectory path
  const trajectoryCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 2),       // 0: Transition from SLS (pushed towards camera)
      new THREE.Vector3(3, 0.5, 0),       // 1: Fly towards moon right
      new THREE.Vector3(5, 0, -6),        // 2: Beside Moon Right
      new THREE.Vector3(0, 0, -10),       // 3: Behind Moon
      new THREE.Vector3(-5, 0, -6),       // 4: Beside Moon Left
      new THREE.Vector3(0, 0, -2.5),      // 5: Crossing FRONT of Moon
      new THREE.Vector3(-3, -0.5, 0),     // 6: Returning to Earth
      new THREE.Vector3(0, -2, 2),        // 7: Reentry Splashdown (pushed towards camera)
    ], false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    const raw = scrollProgress.current;
    
    // Hide everything before the Journey phase starts
    if (raw <= 6.3) {
      if (slsGroup.current) slsGroup.current.visible = false;
      if (orionGroup.current) orionGroup.current.visible = false;
      if (moonRef.current) moonRef.current.visible = false;
      return;
    }

    if (!earthRef.current) return;

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

    // Phase 1 (Launch & Outbound): 6.3 -> 8.5
    if (raw > 6.3 && raw <= 8.5) {
      const t = (raw - 6.3) / 2.2; // 0 -> 1
      
      earthRef.current.visible = true;
      
      if (raw <= 6.8) {
        // Still in MainScene's handover period, but we prepare values
        targetEarthScale = 0.6 + ((raw - 6.3) / 0.5) * 0.6;
        targetEarthY = -1.5 + ((raw - 6.3) / 0.5) * 0.3;
        targetEarthX = 1.7 * (1 - (raw - 6.3) / 0.5);
      } else {
        // Full control after 6.8
        const p = (raw - 6.8) / 1.7; // 0 -> 1
        targetEarthScale = 1.2 * (1 - p * 0.5); // Earth starts large and shrinks as we leave
        targetEarthY = -1.2 - p * 2; // Earth drops away
        targetEarthX = 0;
        
        if (p < 0.3) {
          slsVisible = true;
          orionVisible = false;
          // SLS starts from the surface (Earth radius 2, Earth Y -1.2 => surface Y 0.8)
          // It blasts off towards the camera (Z increases)
          const launchP = p / 0.3;
          targetSlsY = 0.8 + launchP * 4;
          targetSlsScale = 0.2;
          // SLS also moves slightly towards camera
          slsGroup.current.position.z = launchP * 2;
        } else {
          slsVisible = false;
          orionVisible = true;
          
          // Smoothly transition Orion onto the curve
          const curve_t = (p - 0.3) / 0.7 * 0.4; 
          const targetPos = trajectoryCurve.getPoint(curve_t);
          const tangent = trajectoryCurve.getTangent(curve_t);

          targetOrionX = targetPos.x;
          targetOrionY = targetPos.y;
          targetOrionZ = targetPos.z;
          targetOrionLookTarget = targetPos.clone().add(tangent);
        }
      }

      targetMoonScale = t * 1.5;
    }
    // Phase 2 (Moon Loop): 8.5 -> 10.5
    else if (raw > 8.5 && raw <= 10.5) {
      const t = (raw - 8.5) / 2.0; // 0 -> 1
      const curve_t = 0.4 + (t * 0.6); // 0.4 -> 1.0 (Completes return)

      slsVisible = false;
      orionVisible = true;
      targetMoonScale = 1.5 * (1 - t * 0.4);

      const targetPos = trajectoryCurve.getPoint(curve_t);
      const tangent = trajectoryCurve.getTangent(curve_t);

      targetOrionX = targetPos.x;
      targetOrionY = targetPos.y;
      targetOrionZ = targetPos.z;
      
      if (curve_t > 0.8) {
        // Prepare for return: look towards Earth
        targetOrionLookTarget = targetPos.clone().sub(tangent);
      } else {
        targetOrionLookTarget = targetPos.clone().add(tangent);
      }

      targetEarthScale = 1.0;
      targetEarthY = -1.5 + (t * 0.5); // Center Earth more
    }
    // Phase 3 (Post-Journey / Static Earth): 10.5 -> 15.0
    else if (raw > 10.5) {
      const t = Math.min((raw - 10.5) / 4.5, 1); // 0 -> 1
      
      slsVisible = false;
      orionVisible = false; // Hide Orion after journey loop is done
      targetMoonScale = 0.2; // Keep moon small in bg

      targetEarthScale = 1.0;
      targetEarthY = 0; // Centered
      targetEarthX = 0;
      
      // We will handle blurring in SceneManager
    }

    if (slsGroup.current) slsGroup.current.visible = slsVisible;
    if (orionGroup.current) orionGroup.current.visible = orionVisible;
    if (moonRef.current) moonRef.current.visible = (raw > 6);

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

    const currentEarthScale = earthRef.current.scale.x;
    const nextEarthScale = currentEarthScale + (targetEarthScale - currentEarthScale) * 0.04;
    earthRef.current.scale.setScalar(nextEarthScale);
    
    earthRef.current.position.x += (targetEarthX - earthRef.current.position.x) * 0.04;
    earthRef.current.position.y += (targetEarthY - earthRef.current.position.y) * 0.04;
    earthRef.current.position.z += (targetEarthZ - earthRef.current.position.z) * 0.04;
  });

  return (
    <group>
      {/* Launch Vehicle */}
      <group ref={slsGroup} visible={false}>
        <Suspense fallback={null}>
          <Rocket />
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
    </group>
  );
}
