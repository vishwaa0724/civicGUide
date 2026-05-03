import { useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Hourglass } from 'lucide-react';
import { motion } from 'framer-motion';
import { ELECTION_DATA, OTHER_STATES } from '../data/elections.js';
import { trackEvent } from '../firebase.js';

const StatusBadge = ({ status }) => {
  const configs = {
    completed: { icon: CheckCircle2, label: 'Voting Complete', className: 'bg-green-100 text-green-700 border-green-200' },
    upcoming:  { icon: Hourglass,    label: 'In 2 Days',       className: 'bg-blue-100 text-blue-700 border-blue-200' },
    live:      { icon: AlertCircle,  label: 'Live Now',         className: 'bg-red-100 text-red-600 border-red-200 animate-pulse' },
  };
  const cfg = configs[status] || configs.upcoming;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.className}`}>
      <Icon size={12} aria-hidden="true" />
      {cfg.label}
    </span>
  );
};

/**
 * ElectionCalendar — phase-by-phase schedule for the 2026 India Assembly Elections.
 * Data sourced from src/data/elections.js for easy maintenance.
 * Fires analytics on Google Calendar add-click.
 */
export const ElectionCalendar = () => {
  const [selectedState, setSelectedState] = useState(0);
  const current = ELECTION_DATA[selectedState];

  const handleAddToCalendar = (event) => {
    trackEvent('calendar_link_clicked', { event_name: event });
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `India Elections 2026 — ${event}`
    )}&details=${encodeURIComponent('Election Commission of India | Assembly Elections 2026')}&dates=20260504/20260504`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-24 bg-slate-50 relative" id="calendar" aria-labelledby="calendar-heading">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              Live — India Assembly Elections 2026
            </div>
            <h2 id="calendar-heading" className="text-4xl font-bold text-slate-900 tracking-tight">Election Calendar</h2>
            <p className="mt-2 text-slate-500">Real-time schedule for ongoing state assembly elections across India.</p>
          </div>

          {/* State Switcher */}
          <div className="flex gap-3" role="group" aria-label="Select state">
            {ELECTION_DATA.map((s, i) => (
              <button
                key={s.state}
                onClick={() => setSelectedState(i)}
                aria-pressed={selectedState === i}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                  selectedState === i
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s.flag} {s.state}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Selected State Detail */}
        <motion.div
          key={current.state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-material-1 overflow-hidden mb-8"
          role="region"
          aria-label={`${current.state} election schedule`}
        >
          <div className={`bg-gradient-to-r ${current.color} p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl mb-2" aria-hidden="true">{current.flag}</div>
                <h3 className="text-2xl font-bold">{current.state} Assembly Elections 2026</h3>
                <p className="text-white/80 mt-1">{current.totalSeats} Assembly Constituencies · Election Commission of India</p>
              </div>
              <div className="text-right" aria-hidden="true">
                <div className="text-4xl font-black opacity-20">{current.totalSeats}</div>
                <div className="text-white/70 text-sm -mt-2">Total Seats</div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {current.phases.map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${current.light} border flex items-center justify-center flex-shrink-0`}>
                      <CalendarDays size={18} className={current.accent} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className={`text-xs font-bold uppercase tracking-wider ${current.accent}`}>{phase.phase}</span>
                        <StatusBadge status={phase.status} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{phase.event}</h4>
                      <p className="text-slate-500 text-sm mt-1">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Clock size={16} className="text-slate-400" aria-hidden="true" />
                      <time>{phase.date}</time>
                    </div>
                    {phase.seats && <div className="text-sm text-slate-500">{phase.seats} Seats</div>}
                    {phase.status === 'upcoming' && (
                      <button
                        onClick={() => handleAddToCalendar(phase.event)}
                        aria-label={`Add ${phase.event} to Google Calendar`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-slate-500"
                        data-testid="add-to-calendar"
                      >
                        <CalendarDays size={14} aria-hidden="true" /> Add to Google Calendar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Other States Mini Cards */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            Also Voting — Results on May 4, 2026
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {OTHER_STATES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="font-bold text-slate-900">{s.state}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{s.seats} Seats</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />
                    <time>Results: {s.result}</time>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
