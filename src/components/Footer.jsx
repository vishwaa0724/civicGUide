import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">CiviGuide<span className="text-google-blue">.</span></h3>
          <p className="max-w-sm mb-6">
            Empowering citizens through civic education and seamless access to election information. 
            Built with Material Design 3.
          </p>
          <div className="flex gap-4">
            <button className="text-sm hover:text-white transition-colors">English</button>
            <span className="text-slate-600">|</span>
            <button className="text-sm hover:text-white transition-colors">Español</button>
            <span className="text-slate-600">|</span>
            <button className="text-sm hover:text-white transition-colors">Accessibility (A)</button>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How Elections Work</a></li>
            <li><a href="#calendar" className="hover:text-blue-400 transition-colors">Election Calendar</a></li>
            <li><a href="#candidates" className="hover:text-blue-400 transition-colors">Candidate Profiles</a></li>
            <li><a href="#vote-100" className="hover:text-blue-400 transition-colors">100% Voting Mission</a></li>
            <li><a href="#journey" className="hover:text-blue-400 transition-colors">Voter Journey</a></li>
            <li><a href="#finder" className="hover:text-blue-400 transition-colors">Find Booth</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Official Gov Data</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
        <p>© {new Date().getFullYear()} CiviGuide. Not an official government entity.</p>
        <p className="mt-4 md:mt-0 text-sm">Powered by Google Cloud & Gemini AI</p>
      </div>
    </footer>
  );
};
