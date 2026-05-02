import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Award, ExternalLink } from 'lucide-react';
import { CANDIDATES_BY_STATE } from '../data/elections.js';

const statusConfig = {
  incumbent:  { label: 'Incumbent',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
  opposition: { label: 'Opposition',  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  challenger: { label: 'Challenger',  color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

/**
 * CandidateDetails — key candidate profiles for the 2026 Assembly Elections.
 * Data sourced from the centralised elections data module.
 */
export const CandidateDetails = () => {
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const candidates = CANDIDATES_BY_STATE[selectedState];

  return (
    <section className="py-24 bg-slate-50" id="candidates" aria-labelledby="candidates-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Users size={13} aria-hidden="true" /> Key Candidates — 2026 Assembly Elections
            </div>
            <h2 id="candidates-heading" className="text-4xl font-bold text-slate-900 tracking-tight">Candidate Profiles</h2>
            <p className="mt-2 text-slate-500">Know who's contesting in the ongoing state elections.</p>
          </div>

          {/* State Switcher */}
          <div className="flex gap-3" role="group" aria-label="Select state for candidates">
            {Object.keys(CANDIDATES_BY_STATE).map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                aria-pressed={selectedState === state}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                  selectedState === state
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Candidate Cards */}
        <ul className="grid md:grid-cols-2 gap-6" aria-label={`${selectedState} candidates`}>
          {candidates.map((candidate, i) => {
            const status = statusConfig[candidate.status];
            return (
              <motion.li
                key={candidate.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Party-coloured avatar */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border-2"
                    style={{ backgroundColor: candidate.partyColor + '15', borderColor: candidate.partyColor + '30' }}
                    aria-label={`${candidate.party} symbol`}
                  >
                    {candidate.symbol}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{candidate.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: candidate.partyColor + '20', color: candidate.partyColor }}
                          >
                            {candidate.party}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-3">{candidate.position}</p>

                    <dl className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={13} className="text-slate-400" aria-hidden="true" />
                        <dt className="sr-only">Constituency</dt>
                        <dd>{candidate.constituency}</dd>
                      </div>
                      {candidate.votes2021 !== '—' && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Award size={13} className="text-slate-400" aria-hidden="true" />
                          <dt className="sr-only">2021 vote count</dt>
                          <dd>{candidate.votes2021} votes (2021)</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        {/* Disclaimer + Link */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl">
          <p className="text-sm text-slate-500">
            <strong>Note:</strong> Data is based on officially declared candidates by the Election Commission of India. Vote counts are from the 2021 elections.
          </p>
          <a
            href="https://www.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Full ECI Candidate List (opens in new tab)"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Full ECI Candidate List <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
