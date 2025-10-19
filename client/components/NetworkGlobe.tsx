import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface Tower {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  threatLevel: number;
}

interface NetworkGlobeProps {
  towers: Tower[];
  attackedTowerId?: string;
}

const GLOBE_RADIUS = 2;
const TOWER_HEIGHT = 0.3;

function latLngToVector3(latitude: number, longitude: number): THREE.Vector3 {
  const lat = (latitude * Math.PI) / 180;
  const lng = (longitude * Math.PI) / 180;

  const x = GLOBE_RADIUS * Math.cos(lat) * Math.cos(lng);
  const y = GLOBE_RADIUS * Math.sin(lat);
  const z = GLOBE_RADIUS * Math.cos(lat) * Math.sin(lng);

  return new THREE.Vector3(x, y, z);
}

function getTowerColor(threatLevel: number): THREE.Color {
  if (threatLevel < 30) return new THREE.Color(0x22c55e); // Green
  if (threatLevel < 60) return new THREE.Color(0xeab308); // Yellow
  if (threatLevel < 80) return new THREE.Color(0xf97316); // Orange
  return new THREE.Color(0xef4444); // Red
}

function TowerMarker({
  tower,
  isAttacked,
}: {
  tower: Tower;
  isAttacked: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const position = latLngToVector3(tower.latitude, tower.longitude);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(0, 0, 0);
    }
    if (pulseRef.current && isAttacked) {
      pulseRef.current.scale.multiplyScalar(1.02);
      if (pulseRef.current.scale.x > 2) {
        pulseRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const color = getTowerColor(tower.threatLevel);

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      {/* Main tower cone */}
      <mesh position={[0, TOWER_HEIGHT / 2, 0]}>
        <coneGeometry args={[0.15, TOWER_HEIGHT, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isAttacked ? 1 : 0.3}
        />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Pulsing attack indicator */}
      {isAttacked && (
        <mesh ref={pulseRef} position={[0, TOWER_HEIGHT + 0.2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={0xff0000}
            wireframe={true}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

function AttackLine({
  fromTower,
  toTower,
  progress,
}: {
  fromTower: Tower;
  toTower: Tower;
  progress: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (lineRef.current) {
      const positions = (lineRef.current.geometry as THREE.BufferGeometry)
        .attributes.position.array as Float32Array;

      const from = latLngToVector3(fromTower.latitude, fromTower.longitude);
      const to = latLngToVector3(toTower.latitude, toTower.longitude);
      const current = from.clone().lerp(to, Math.min(progress, 1));

      positions[3] = current.x;
      positions[4] = current.y;
      positions[5] = current.z;

      (
        lineRef.current.geometry as THREE.BufferGeometry
      ).attributes.position.needsUpdate = true;
    }
  });

  const from = latLngToVector3(fromTower.latitude, fromTower.longitude);
  const to = latLngToVector3(toTower.latitude, toTower.longitude);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array([from.x, from.y, from.z, from.x, from.y, from.z]),
      3,
    ),
  );

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={0xff0000}
        linewidth={2}
        transparent
        opacity={0.6}
      />
    </line>
  );
}

function GlobeContent({
  towers,
  attackedTowerId,
  attackProgress,
}: {
  towers: Tower[];
  attackedTowerId?: string;
  attackProgress: number;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Globe */}
      <Sphere args={[GLOBE_RADIUS, 64, 64]}>
        <meshStandardMaterial
          color={0x0f172a}
          wireframe={true}
          wireframeLinewidth={0.5}
          transparent
          opacity={0.2}
        />
      </Sphere>

      {/* Towers */}
      {towers.map((tower) => (
        <TowerMarker
          key={tower.id}
          tower={tower}
          isAttacked={tower.id === attackedTowerId}
        />
      ))}

      {/* Attack propagation lines */}
      {attackedTowerId && attackProgress > 0 && towers.length > 1 && (
        <AttackLine
          fromTower={towers.find((t) => t.id === attackedTowerId)!}
          toTower={
            towers[
              (towers.findIndex((t) => t.id === attackedTowerId) + 1) %
                towers.length
            ]
          }
          progress={attackProgress}
        />
      )}

      {/* Controls */}
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </>
  );
}

export function NetworkGlobe({ towers, attackedTowerId }: NetworkGlobeProps) {
  const [attackProgress, setAttackProgress] = useState(0);

  useEffect(() => {
    if (!attackedTowerId) {
      setAttackProgress(0);
      return;
    }

    let animationFrame: ReturnType<typeof requestAnimationFrame>;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % 2000) / 2000;
      setAttackProgress(progress);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [attackedTowerId]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeContent
          towers={towers}
          attackedTowerId={attackedTowerId}
          attackProgress={attackProgress}
        />
      </Canvas>
    </div>
  );
}
