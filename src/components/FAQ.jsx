import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/elections.js';

/**
 * Accessible accordion FAQ section.
 * — Uses `aria-expanded`, `aria-controls`, and `id` for full screen-reader support.
 * — Focus ring visible on keyboard navigation (no outline-none suppression).
 * — Content sourced from the centralised elections data module.
 */
export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50" id="faq" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-4xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">Quick answers to common queries about voting in India.</p>
        </div>

        <div className="space-y-4" role="list">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-btn-${index}`;

            return (
              <div
                key={index}
                role="listitem"
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                data-testid={`faq-item-${index}`}
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  data-testid={`faq-button-${index}`}
                >
                  <span className="font-semibold text-slate-900 text-left text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  >
                    <ChevronDown className="text-slate-400 flex-shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      data-testid={`faq-answer-${index}`}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
