import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { HowElectionsWork } from './components/HowElectionsWork';
import { ElectionCalendar } from './components/ElectionCalendar';
import { VoterJourney } from './components/VoterJourney';
import { VotingMotivation } from './components/VotingMotivation';
import { CandidateDetails } from './components/CandidateDetails';
import { AssistantChat } from './components/AssistantChat';
import { ConstituencyFinder } from './components/ConstituencyFinder';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

const navLinks = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#calendar', label: 'Calendar' },
  { href: '#candidates', label: 'Candidates' },
  { href: '#journey', label: 'My Journey' },
  { href: '#assistant', label: 'AI Assistant' },
  { href: '#finder', label: 'Find Booth' },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-xl font-bold text-slate-900 tracking-tight">
            CiviGuide<span className="text-blue-600">.</span>
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-blue-600 transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — Vote CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://voters.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Register to Vote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://voters.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold text-center"
            >
              Register to Vote
            </a>
          </div>
        )}
      </header>

      <main>
        <Hero />
        <HowElectionsWork />
        <ElectionCalendar />
        <CandidateDetails />
        <VotingMotivation />
        <VoterJourney />
        <AssistantChat />
        <ConstituencyFinder />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

export default App;
