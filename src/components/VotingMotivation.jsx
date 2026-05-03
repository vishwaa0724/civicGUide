import { motion } from 'framer-motion';
import { Vote, Users, TrendingUp, Heart, Star, ArrowRight } from 'lucide-react';

const stats = [
  { value: '96.8Cr', label: 'Registered Voters', sub: 'Largest electorate on Earth', color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: '67.4%', label: '2024 National Turnout', sub: 'Record high for Lok Sabha', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: '1 Vote', label: 'Can Change History', sub: 'Elections won by single digits', color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: '100%', label: 'Our Goal', sub: 'Every eligible citizen votes', color: 'text-orange-600', bg: 'bg-orange-50' },
];

const quotes = [
  { quote: "The ballot is stronger than the bullet.", author: "Abraham Lincoln" },
  { quote: "Vote as if your life depends on it — because it does.", author: "Loung Ung" },
  { quote: "Democracy is not a spectator sport.", author: "Thurgood Marshall" },
];

const reasons = [
  { icon: Vote, title: "Your Single Vote Matters", desc: "In the 2022 Gujarat elections, 3 seats were decided by fewer than 50 votes. Your vote is never wasted." },
  { icon: Users, title: "Shape Your Community", desc: "Local representatives control schools, hospitals, roads, and water. Voting decides who manages your neighbourhood." },
  { icon: TrendingUp, title: "Hold Leaders Accountable", desc: "Politicians perform better when they know citizens are watching and voting. Participation is the strongest check." },
  { icon: Heart, title: "Honour Those Who Fought For It", desc: "India's democracy was hard won. Casting your vote is an act of gratitude to freedom fighters." },
];

export const VotingMotivation = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden" id="vote-100">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            <Star size={14} /> Mission: 100% Voter Participation
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tight">
            Why Your Vote Matters
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            India is the world's largest democracy. Let's make it the most participative one too.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-colors"
            >
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/90 font-semibold text-sm">{stat.label}</div>
              <div className="text-white/75 text-xs mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Reasons to Vote */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">{reason.title}</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">{reason.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quotes */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-6"
            >
              <div className="text-4xl text-white/30 font-serif mb-2">"</div>
              <p className="text-white font-medium italic mb-3">{q.quote}</p>
              <p className="text-blue-200 text-sm">— {q.author}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://voters.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all"
          >
            Register / Verify Your Vote Now
            <ArrowRight size={20} />
          </a>
          <p className="text-blue-200 text-sm mt-4">Official Election Commission of India voter portal</p>
        </motion.div>
      </div>
    </section>
  );
};
