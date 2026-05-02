import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mic2, Vote, BarChart3, Trophy } from 'lucide-react';

/**
 * Animated step badge — replaces the previous per-step WebGL Canvas.
 * Using CSS + Framer Motion avoids spinning up 5 separate WebGL contexts,
 * which was expensive and hit browser limits on lower-end devices.
 */
const StepBadge = ({ color, index, isActive }) => (
  <motion.div
    className="w-16 h-16 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 flex-shrink-0"
    style={{ backgroundColor: isActive ? color : '#e2e8f0' }}
    animate={isActive ? { scale: [1, 1.08, 1] } : {}}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
    aria-hidden="true"
  >
    <motion.div
      className="w-3 h-3 rounded-full bg-white/80"
      animate={isActive ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.3 }}
      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
    />
  </motion.div>
);

const steps = [
  {
    title: 'Nomination',
    description:
      'Political parties and independent candidates file nomination papers. Each is scrutinised for eligibility — citizenship, age, and no disqualifications.',
    icon: Mic2,
    color: '#1A73E8',
    bg: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
  },
  {
    title: 'Campaigning',
    description:
      'Candidates, parties, and alliances run public campaigns — rallies, debates, and manifestos — in a Model Code of Conduct enforced by the Election Commission.',
    icon: UserPlus,
    color: '#4F46E5',
    bg: 'from-indigo-50 to-indigo-100/50',
    border: 'border-indigo-200',
    accent: 'text-indigo-600',
  },
  {
    title: 'Voting Day',
    description:
      'Citizens cast their votes at designated EVM booths from 7 AM to 6 PM. VVPAT paper slips allow voters to verify their choice instantly.',
    icon: Vote,
    color: '#059669',
    bg: 'from-emerald-50 to-emerald-100/50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
  },
  {
    title: 'Counting',
    description:
      'Ballots are counted in secure counting centres under strict observation. Postal ballots and EVM counts are tallied round by round and declared publicly.',
    icon: BarChart3,
    color: '#D97706',
    bg: 'from-amber-50 to-amber-100/50',
    border: 'border-amber-200',
    accent: 'text-amber-600',
  },
  {
    title: 'Results',
    description:
      'Winners are officially declared by Returning Officers. The elected legislature convenes and the majority party or coalition forms the government.',
    icon: Trophy,
    color: '#DC2626',
    bg: 'from-red-50 to-red-100/50',
    border: 'border-red-200',
    accent: 'text-red-600',
  },
];

/**
 * HowElectionsWork — zigzag timeline explaining India's 5-stage election process.
 *
 * Performance: previously used 5 separate <Canvas> WebGL contexts (one per step node).
 * Replaced with lightweight CSS animated badges — saves ~5 WebGL contexts and
 * significantly reduces GPU memory usage on mobile devices.
 */
export const HowElectionsWork = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="how-it-works" aria-labelledby="how-heading">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(#1A73E8 1px, transparent 1px), linear-gradient(90deg, #1A73E8 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold tracking-wide uppercase mb-4">
            The Process
          </span>
          <h2 id="how-heading" className="text-5xl font-bold text-slate-900 tracking-tight">
            How Elections Work
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-xl mx-auto">
            From nomination to the final result — every step of India's democratic process.
          </p>
        </motion.div>

        {/* Steps */}
        <ol className="relative" aria-label="Election process steps">
          {/* Vertical spine line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-red-200 transform -translate-x-1/2 hidden md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
                className={`flex items-center mb-20 last:mb-0 gap-0 md:gap-8 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div className="w-full md:w-[calc(50%-2rem)]">
                  <div
                    className={`relative bg-gradient-to-br ${step.bg} border ${step.border} rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden`}
                  >
                    {/* Step number watermark */}
                    <span
                      className="absolute -top-4 -right-3 text-[7rem] font-black opacity-[0.06] leading-none select-none text-slate-900"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className={`flex items-center gap-3 mb-4 ${step.accent}`}>
                      <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest">Step {index + 1}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Centre animated badge node — CSS only, zero WebGL */}
                <div className="hidden md:flex w-16 flex-col items-center flex-shrink-0">
                  <StepBadge color={step.color} index={index} isActive />
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
