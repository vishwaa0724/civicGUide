# CiviGuide — India Election Education Platform

> A premium, interactive civic-education web application built for the 2026 India State Assembly Elections. CiviGuide helps citizens — especially first-time voters — understand the democratic process, track real election schedules, explore constituency maps, learn about key candidates, and get instant answers from an AI assistant powered by Google Gemini.

---

## 🗳️ Chosen Vertical

**Civic Technology / Election Education**

India has one of the largest democratic systems in the world, yet voter awareness — particularly among first-time voters — remains a significant challenge. CiviGuide targets the **civic education vertical**: demystifying the election process, making it engaging with modern UI/UX, and connecting citizens directly to official ECI resources.

The platform is scoped to the **2026 India State Assembly Elections** (Tamil Nadu, West Bengal, Assam, Kerala, Puducherry), with results on **May 4, 2026**.

---

## 🏗️ Approach & Logic

### Design Philosophy

The application was designed to feel **premium and trustworthy** — reflecting the gravity of electoral participation — while remaining approachable to a general audience. Key design principles:

- **Information hierarchy**: The most actionable content (How It Works, Calendar, AI Assistant) is surfaced first via clear navigation.
- **Progressive disclosure**: Sections reveal details on interaction (click a constituency, select a state, tick a voter checklist item) rather than overwhelming the user upfront.
- **Micro-animations throughout**: Every section uses Framer Motion scroll-triggered animations and hover effects to keep the interface alive and engaging.
- **Official data, no speculation**: All candidate names, constituency seat counts, voting dates, and ECI links reference real public information from the Election Commission of India.

### Technical Approach

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React 19 + Vite 8 | Fast HMR, ESM-native, minimal config |
| Styling | Tailwind CSS v4 | Utility-first, consistent spacing/typography |
| Animations | Framer Motion 12 | Declarative scroll and mount animations |
| 3D Rendering | React Three Fiber + Drei | WebGL scenes embedded directly in JSX |
| Map | React-Leaflet + OpenStreetMap/Overpass | Real boundary data, no proprietary map API |
| AI Chat | Google Gemini 2.5 Flash (`@google/generative-ai`) | Fast, low-latency responses for civic Q&A |
| Icons | Lucide React | Consistent, minimal icon set |
| Hosting | Firebase Hosting | SPA-friendly rewrites, CDN delivery |

---

## 🔍 How the Solution Works

The application is a **single-page React app** composed of 10 standalone section-components, assembled in sequence in `App.jsx`. Navigation is anchor-based (`#section-id`) with a sticky header.

### Component Breakdown

#### `Hero.jsx` — Landing Section
- A full-viewport split layout: animated copy on the left, an **interactive 3D ballot box** on the right.
- The 3D scene is rendered with `@react-three/fiber`. The ballot box rotates, bobs vertically, and has floating ballot papers orbiting it using the `<Float>` helper from Drei.
- Key election stats (528 Constituencies, 73% turnout, 5 states voting) are shown beneath the headline.
- A `useFrame` animation loop drives continuous rotation and sine-wave vertical oscillation without any additional state.

#### `HowElectionsWork.jsx` — Process Explainer
- A vertical **zigzag timeline** with 5 steps: Nomination → Campaigning → Voting Day → Counting → Results.
- Each step card slides in from alternating sides using `whileInView` Framer Motion triggers.
- A central spine line connects all steps on desktop.
- Each step's center node renders a small **3D octahedron** via a dedicated Canvas, changing color and spin speed based on whether the step is "active".

#### `ElectionCalendar.jsx` — Live Election Schedule
- Displays phase-by-phase voting dates for Tamil Nadu (single phase) and West Bengal (two phases), with real seat counts and turnout descriptions.
- State switcher tabs animate the card swap via `motion` with a `key` prop to trigger re-mount animation.
- Phase rows show a `StatusBadge` (Voting Complete / In 2 Days / Live) derived from the phase's status field.
- "Add to Google Calendar" deep-link button for upcoming results day.
- Mini cards below cover Assam, Kerala, and Puducherry.

#### `CandidateDetails.jsx` — Key Candidate Profiles
- Grid of candidate cards for Tamil Nadu and West Bengal, switchable via state toggle.
- Each card shows the candidate's name, party (with brand colour), constituency, role (Incumbent / Opposition / Challenger), and 2021 vote count where available.
- Card avatars use the party's brand colour as a tinted background, with a party symbol emoji.
- Disclaimer footer links directly to `eci.gov.in`.

#### `VotingMotivation.jsx` — Civic Motivation Section
- Emotionally resonant section with civic statistics and motivational content to encourage voter participation.
- Animated counters and call-to-action linking to the official ECI voter registration portal.

#### `VoterJourney.jsx` — Interactive Checklist
- A 4-step readiness checklist: Register → Verify Details → Find Polling Booth → Cast Vote.
- Users can click any step to toggle its completion state.
- A **Framer Motion animated progress bar** reflects real-time completion percentage.

#### `AssistantChat.jsx` — AI Election Assistant
- A fully functional chat interface backed by the **Gemini 2.5 Flash** model.
- A `SYSTEM_PROMPT` constrains the assistant to Indian election topics, discouraging off-topic use.
- Conversation history is maintained client-side and passed as `history` on each `startChat()` call, enabling multi-turn dialogue.
- Scrolling is scoped to the chat container (`chatContainerRef.current.scrollTop`) — not the whole page — preventing disruptive scroll-jacking.
- Markdown responses are rendered via `react-markdown` with `prose` typography.
- Quick-suggestion chips pre-populate common queries.
- Graceful error handling: missing API key surfaces an inline amber warning rather than silently failing.

#### `ConstituencyFinder.jsx` — Interactive Map
- Fetches **real assembly constituency boundary polygons** at runtime from the [Overpass API](https://overpass-api.de/) using OpenStreetMap's `boundary=political / admin_level=6` relations for Tamil Nadu and West Bengal.
- The raw Overpass JSON is converted to GeoJSON in-browser via `overpassToGeoJSON()`, stitching way segments into MultiPolygon features.
- Rendered on a **CartoDB light basemap** via React-Leaflet.
- Key contested seats (Kolathur, Bhawanipur, Nandigram, etc.) are highlighted in violet; selected constituency in blue.
- Clicking any polygon opens a panel with the constituency name, key candidate, voting status, and result date.
- A constituency search input filters by name.
- State switching triggers a smooth `flyTo` animation via the `FlyToState` sub-component that calls `useMap()`.
- Loading / error / retry overlays are stacked above the map at `z-[1000]`.
- Leaflet's default marker icon CDN fix applied for Vite compatibility.

#### `FAQ.jsx` — Frequently Asked Questions
- Expandable accordion-style FAQ covering voter ID, EVM security, VVPAT, and registration deadlines.

#### `Footer.jsx` — Site Footer
- Links to official ECI resources, Voter Helpline (1950), and app sections.

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js ≥ 18
- A Google Gemini API key ([get one free at Google AI Studio](https://aistudio.google.com/))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Deploy to Firebase Hosting (optional)
firebase deploy
```

> The app runs without the Gemini key — all sections except the AI Chat will be fully functional. The chat section will surface a clear inline warning if the key is missing.

---

## 🚀 Deployment

The project is configured for **Firebase Hosting** (`firebase.json`). The `dist/` folder (Vite's build output) is the public root. A catch-all rewrite rule (`"source": "**" → "/index.html"`) enables SPA client-side routing.

```
dist/index.html                     0.45 kB │ gzip:   0.29 kB
dist/assets/index-CC9W2qlR.css     62.78 kB │ gzip:  14.68 kB
dist/assets/index-DnzxC21E.js   1,562.26 kB │ gzip: 442.94 kB
```

---

## 📌 Assumptions Made

| Assumption | Rationale |
|---|---|
| **2026 election dates are correct as of build time** | Tamil Nadu: Apr 23, West Bengal: Apr 23 & 29, Results: May 4, 2026. Sourced from ECI announcements. |
| **Candidate data reflects declared contestants** | Names, parties, and constituencies are from officially declared candidate lists. Vote counts reference 2021 Assembly Elections. |
| **Overpass API is available** | The Constituency Finder depends on the public Overpass API. Temporary downtime shows a retry overlay. No API key required. |
| **OSM `admin_level=6` maps to state assembly constituencies** | This is the established OpenStreetMap convention for Indian assembly (vidhan sabha) constituencies. Data completeness varies by state. |
| **Gemini API key is provided by the developer** | The AI Chat feature requires `VITE_GEMINI_API_KEY` in `.env`. Without it, the feature degrades gracefully. |
| **Single-page architecture is sufficient** | All content fits comfortably on a scrolling single-page layout with anchor navigation. No server-side rendering required for this use case. |
| **Browser WebGL support** | The 3D scenes (Hero ballot box, HowElectionsWork step nodes) require WebGL. Modern browsers universally support this; a `<canvas>` fallback is handled by Three.js. |

---

## 🛠️ Tech Stack Summary

```
React 19 · Vite 8 · Tailwind CSS v4 · Framer Motion 12
Three.js · React Three Fiber · React Three Drei
React Leaflet · Leaflet · OpenStreetMap / Overpass API
Google Gemini 2.5 Flash API · Firebase Hosting
Lucide React · react-markdown
```

---

## 📋 Project Structure

```
h:/ai/
├── src/
│   ├── App.jsx                    # Root layout, sticky nav, section assembly
│   ├── components/
│   │   ├── Hero.jsx               # 3D ballot box + headline
│   │   ├── HowElectionsWork.jsx   # Zigzag timeline with 3D step nodes
│   │   ├── ElectionCalendar.jsx   # Phase-by-phase election schedule
│   │   ├── CandidateDetails.jsx   # Key candidate profile cards
│   │   ├── VotingMotivation.jsx   # Civic motivation + stats
│   │   ├── VoterJourney.jsx       # Interactive voter readiness checklist
│   │   ├── AssistantChat.jsx      # Gemini-powered AI election assistant
│   │   ├── ConstituencyFinder.jsx # Live OSM constituency map
│   │   ├── FAQ.jsx                # Expandable Q&A
│   │   └── Footer.jsx             # Site footer
│   ├── firebase.js                # Firebase app initialisation
│   └── main.jsx                  # React DOM entry point
├── firebase.json                  # Firebase Hosting config (SPA rewrites)
├── vite.config.js                 # Vite build config
└── .env                           # VITE_GEMINI_API_KEY (not committed)
```

---

*Built for the 2026 India National Hackathon — CiviGuide empowers every citizen to participate in democracy with confidence.*
