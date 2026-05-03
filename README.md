# CiviGuide: India Election Education Platform 2026

![CiviGuide Preview](public/favicon.svg) <!-- Replace with an actual screenshot if available -->

CiviGuide is an interactive, AI-powered civic education platform designed to guide first-time Indian voters through the complex electoral process. Built specifically for the upcoming 2026 State Assembly Elections, it gamifies the voter registration journey and provides real-time, personalized assistance to boost voter turnout and democratic participation.

---

## 🏛️ Chosen Vertical
**Civic Technology / Digital Public Goods (EdTech)**
We chose this vertical because voter apathy and lack of clear, accessible information are major hurdles for first-time voters in India. By merging education with technology, CiviGuide acts as a digital public good that strengthens democratic engagement.

---

## 🧠 Approach and Logic
Our approach was to build a solution that doesn't just present information, but **actively engages** the user. We relied on three core pillars:
1. **Gamification:** Breaking down the overwhelming election process into a manageable, 4-step "Voter Journey" checklist that rewards users upon completion.
2. **AI-Driven Personalization:** Using Google's Gemini AI to provide a 24/7 personalized civic assistant that can answer specific questions about EVMs, VVPATs, and polling dates.
3. **Cloud Synchronization:** Leveraging Google Services (Firebase) so users can start their journey on a mobile device and finish it on a desktop without losing progress.

We built the frontend using **React + Vite** for lightning-fast performance, styled it with modern glassmorphic **Tailwind CSS**, and used **React Three Fiber** for an interactive 3D hero section to immediately capture user attention.

---

## ⚙️ How the Solution Works
CiviGuide is a fully functional Single Page Application (SPA) with deep cloud integrations:

* **Authentication & Persistence:** Users authenticate securely via **Firebase Auth (Google Sign-In)**. As they check off items in their Voter Journey (e.g., "Got my Voter ID"), their progress is written directly to **Cloud Firestore**. 
* **Gamification Engine:** When a user completes all steps in their journey, a state listener triggers a full-screen `canvas-confetti` explosion to reward their civic readiness.
* **AI Voice Assistant:** The platform features a custom chatbot powered directly by the **Gemini 2.5 REST API**. We integrated the browser's native Web Speech API, allowing users to dictate their questions via microphone, and the AI will speak its answers out loud—drastically improving accessibility for differently-abled voters.
* **Interactive Constituency Map:** We utilize Leaflet combined with the Overpass API to render interactive boundary maps based on the user's location.

---

## 📝 Assumptions Made
* **Election Focus:** The application's prompt engineering and calendar logic assume the primary focus is the upcoming 2026 State Assembly Elections (Tamil Nadu, West Bengal, Assam, etc.).
* **API Availability:** We assume standard uptime for the Gemini REST API and Overpass (OSM) APIs. The app handles rate-limits gracefully, but assumes the APIs are generally reachable.
* **Modern Browser:** The Web Speech API for voice-to-text and text-to-speech assumes the user is on a modern browser (Chrome/Edge/Safari).
* **Hackathon Demonstration:** Firestore database rules are temporarily configured in `Test Mode` to allow seamless read/write access during the live hackathon grading process without complex role-based access control setup.

---

## 🚀 Run Locally
1. Clone the repository.
2. Run `npm install`
3. Add your API keys to `.env.local` (Gemini, Maps, and Firebase Config).
4. Run `npm run dev` to start the Vite server.
