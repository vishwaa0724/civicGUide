import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

// ─── 3D Ballot Box ───────────────────────────────────────────────────────────
const BallotBox = () => {
  const boxRef = useRef();
  const slotRef = useRef();

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

export const Hero = () => {
  return (
    <section className="relative w-full h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left — Text */}
        <div className="flex flex-col items-start">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            India Elections 2026 — Results: May 4
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Your Voice.<br />
            <span className="text-blue-600">Your Vote.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-slate-600 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Navigate India's election process with confidence. Learn how democracy works, find your polling booth, and cast your vote.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#how-it-works" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              How It Works
            </a>
            <a href="#assistant" className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-200 rounded-full font-semibold hover:bg-blue-50 hover:-translate-y-0.5 transition-all">
              Ask AI Assistant
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="mt-12 flex gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { num: '528', label: 'Constituencies' },
              { num: '73%', label: 'Avg. Turnout' },
              { num: '5', label: 'States Voting' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-blue-600">{stat.num}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Ballot Box (decorative, hidden from screen readers) */}
        <motion.div
          className="h-[420px] md:h-[520px] w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          aria-hidden="true"
          role="presentation"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4F46E5" />
            <pointLight position={[5, -5, 5]} intensity={0.3} color="#FBBC05" />
            <BallotBox />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Canvas>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-9 border-2 border-slate-300 rounded-full flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1.5 h-1.5 bg-slate-400 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};
