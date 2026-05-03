import { useState } from 'react';
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
import { AuthProvider, useAuth } from './context/AuthContext';

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

          {/* Right — Vote CTA & Auth */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButtons />
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

/**
 * Renders the Auth Login/Logout buttons
 */
const AuthButtons = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
        <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
          Log out
        </button>
      </div>
    );
  }
  return (
    <button onClick={loginWithGoogle} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in
    </button>
  );
};

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
