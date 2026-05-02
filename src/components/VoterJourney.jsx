import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { trackEvent } from '../firebase.js';

const journeySteps = [
  { id: 1, title: 'Register to Vote', detail: 'Check eligibility and submit Form 6 on the NVSP portal.' },
  { id: 2, title: 'Verify Your Details', detail: 'Confirm your name is correctly spelled on the electoral roll.' },
  { id: 3, title: 'Find Your Polling Booth', detail: 'Locate your designated voting station via voters.eci.gov.in.' },
  { id: 4, title: 'Cast Your Vote', detail: 'Bring a valid photo ID and cast your vote on election day.' },
];

/**
 * Interactive voter readiness checklist.
 * — Persists completed steps to localStorage across page reloads.
 * — Step items rendered as <button role="checkbox"> for full keyboard accessibility.
 * — Fires analytics events on each toggle.
 */
export const VoterJourney = () => {
  // Persist completed step IDs across reloads
  const [completed, setCompleted] = useLocalStorage('voter-journey-completed', [1]);

  const toggle = (id) => {
    const next = completed.includes(id)
      ? completed.filter((s) => s !== id)
      : [...completed, id];
    setCompleted(next);
    trackEvent('journey_step_toggled', {
      step_id: id,
      completed: !completed.includes(id),
    });
  };

  const progress = (completed.length / journeySteps.length) * 100;

  return (
    <section className="py-24 bg-white" id="journey" aria-labelledby="journey-heading">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-material-1 border border-slate-100">
          <div className="text-center mb-10">
            <h2 id="journey-heading" className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Your Voter Journey
            </h2>
            <p className="mt-3 text-slate-600">Track your readiness for the upcoming election.</p>
          </div>

          {/* Progress bar */}
          <div className="mb-10" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Voter journey progress">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-3">
              <span>Progress</span>
              <span className="text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                data-testid="progress-bar"
              />
            </div>
          </div>

          {/* Step list */}
          <ul className="space-y-4" aria-label="Voter checklist steps">
            {journeySteps.map((step) => {
              const isDone = completed.includes(step.id);
              return (
                <li key={step.id}>
                  <button
                    role="checkbox"
                    aria-checked={isDone}
                    onClick={() => toggle(step.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all border text-left focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isDone ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                    data-testid={`journey-step-${step.id}`}
                  >
                    <span className={`mt-0.5 transition-colors flex-shrink-0 ${isDone ? 'text-blue-600' : 'text-slate-300'}`} aria-hidden="true">
                      {isDone ? <CheckCircle2 size={24} className="fill-blue-100" /> : <Circle size={24} />}
                    </span>
                    <span>
                      <span className={`block text-lg font-semibold ${isDone ? 'text-blue-600' : 'text-slate-900'}`}>
                        {step.title}
                      </span>
                      <span className="block text-slate-500 mt-1 text-sm">{step.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
