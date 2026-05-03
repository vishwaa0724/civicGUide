import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { BallotBox } from './3d/BallotBox';

/**
 * Hero Component
 * Displays the main landing section with a 3D Ballot Box and live updates ticker.
 *
 * @returns {JSX.Element}
 */
export const Hero = () => {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl" />
      </div>

      {/* Live Ticker Marquee */}
      <div className="absolute top-16 left-0 right-0 bg-blue-600/90 text-white py-1.5 overflow-hidden backdrop-blur-sm z-20 shadow-sm border-y border-blue-500/50">
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="mx-8 text-xs font-semibold tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE: ECI announces 2026 Assembly Election dates
              <span className="mx-4 text-blue-300">•</span> Phase 1 begins April 23
              <span className="mx-4 text-blue-300">•</span> 970 Million Eligible Voters
              <span className="mx-4 text-blue-300">•</span> Don't forget your Voter ID
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-8 items-center pt-16">
        {/* Left — Text */}
        <div className="flex flex-col items-start">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6 shadow-sm border border-blue-200/50 backdrop-blur-md"
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Your Vote.</span>
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
            <a href="#how-it-works" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              How It Works
            </a>
            <a href="#assistant" className="px-8 py-4 bg-white/80 backdrop-blur-md text-blue-600 border border-blue-200 rounded-full font-semibold shadow-sm hover:bg-blue-50 hover:-translate-y-0.5 transition-all">
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
                <div className="text-sm text-slate-500 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Ballot Box (decorative, hidden from screen readers) */}
        <motion.div
          className="h-[420px] md:h-[520px] w-full relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          aria-hidden="true"
          role="presentation"
        >
          {/* Glass orb behind 3D object */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 bg-blue-400/20 rounded-full blur-[60px]" />
          </div>
          
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4F46E5" />
            <pointLight position={[5, -5, 5]} intensity={0.3} color="#FBBC05" />
            <BallotBox />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
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
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">Scroll</span>
        <div className="w-5 h-9 border-2 border-slate-300 rounded-full flex items-start justify-center pt-1.5 shadow-sm">
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
