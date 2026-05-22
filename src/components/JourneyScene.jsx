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

    // Phase 1 (Launch & Outbound): 6.3 -> 8.0
    if (raw > 6.3 && raw <= 8.0) {
      const t = (raw - 6.3) / 1.7; // 0 -> 1
      
      earthRef.current.visible = true;
      // Stylish fade in: scale from 0 to 1 and rise from below
      targetEarthScale = t;
      targetEarthY = -2 + (t * 0.5); // Rises to -1.5

      if (t < 0.4) {
        slsVisible = true;
        orionVisible = false;
        // SLS emerges from the top of the Earth (Y=2 relative to Earth)
        targetSlsY = targetEarthY + (t * 10); 
        targetSlsScale = 0.2;
      } else {
        slsVisible = false;
        orionVisible = true;
        
        // Start curve earlier to complete loop by 9
        const curve_t = (t - 0.4) / 0.6 * 0.4; 
        const targetPos = trajectoryCurve.getPoint(curve_t);
        const tangent = trajectoryCurve.getTangent(curve_t);

        targetOrionX = targetPos.x;
        targetOrionY = targetPos.y;
        targetOrionZ = targetPos.z;
        targetOrionLookTarget = targetPos.clone().add(tangent);
      }

      targetMoonScale = t * 1.2;
    }
    // Phase 2 (Moon Loop): 8.0 -> 9.8
    else if (raw > 8.0 && raw <= 9.8) {
      const t = (raw - 8.0) / 1.8; // 0 -> 1
      const curve_t = 0.4 + (t * 0.6); // 0.4 -> 1.0 (Completes return)

      slsVisible = false;
      orionVisible = true;
      targetMoonScale = 1.2 * (1 - t * 0.5);

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
    // Phase 3 (Post-Journey / Static Earth): 9.8 -> 14.8
    else if (raw > 9.8) {
      const t = Math.min((raw - 9.8) / 5, 1); // 0 -> 1
      
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
