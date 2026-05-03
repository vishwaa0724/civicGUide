import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';

/**
 * Interactive 3D Ballot Box Component
 * @returns {JSX.Element}
 */
export const BallotBox = () => {
  const boxRef = useRef();

  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      boxRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group ref={boxRef} position={[0, 0, 0]}>
      {/* Main ballot box body */}
      <RoundedBox args={[1.8, 2, 1.4]} radius={0.08} smoothness={4} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#1A73E8" metalness={0.3} roughness={0.4} />
      </RoundedBox>

      {/* Box lid */}
      <RoundedBox args={[1.9, 0.25, 1.5]} radius={0.05} smoothness={4} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#1557B0" metalness={0.4} roughness={0.3} />
      </RoundedBox>

      {/* Vote slot on top */}
      <mesh position={[0, 0.94, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.12]} />
        <meshStandardMaterial color="#0d1b2a" />
      </mesh>

      {/* ECI emblem circle */}
      <mesh position={[0, 0.1, 0.72]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#FBBC05" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Floating ballot papers */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[1.4, 0.6, 0]} rotation={[0, 0, 0.3]}>
          <planeGeometry args={[0.55, 0.7]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-1.4, 0.2, 0.2]} rotation={[0, 0.2, -0.2]}>
          <planeGeometry args={[0.55, 0.7]} />
          <meshStandardMaterial color="#e8f0fe" />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[1.2, -0.6, 0.4]} rotation={[0.1, 0, 0.15]}>
          <planeGeometry args={[0.55, 0.7]} />
          <meshStandardMaterial color="#fff8e1" />
        </mesh>
      </Float>
    </group>
  );
};
