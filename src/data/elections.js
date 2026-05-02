/**
 * @file elections.js
 * Centralised data constants for the 2026 India State Assembly Elections.
 * Sourced from the Election Commission of India (ECI).
 * Keeping data separate from components makes updates and testing easier.
 */

// ─── Election Phase Data ───────────────────────────────────────────────────────
export const ELECTION_DATA = [
  {
    state: 'Tamil Nadu',
    flag: '🏛️',
    totalSeats: 234,
    phases: [
      {
        phase: 'Phase 1',
        event: 'Voting Day',
        date: 'Apr 23, 2026',
        status: 'completed',
        seats: 234,
        description:
          'All 234 assembly constituencies voted in a single phase. Record 73.2% turnout reported across the state.',
      },
      {
        phase: 'Results',
        event: 'Vote Counting & Result',
        date: 'May 4, 2026',
        status: 'upcoming',
        seats: 234,
        description: 'Counting of votes begins at 8 AM across all districts. Results expected by afternoon.',
      },
    ],
    color: 'from-orange-500 to-amber-500',
    light: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-600',
  },
  {
    state: 'West Bengal',
    flag: '🌿',
    totalSeats: 294,
    phases: [
      {
        phase: 'Phase 1',
        event: 'Voting Day — Phase 1',
        date: 'Apr 23, 2026',
        status: 'completed',
        seats: 148,
        description:
          '148 constituencies voted in Phase 1. Voter turnout stood at approximately 76% in the first phase.',
      },
      {
        phase: 'Phase 2',
        event: 'Voting Day — Phase 2',
        date: 'Apr 29, 2026',
        status: 'completed',
        seats: 146,
        description:
          "Remaining 146 constituencies voted in Phase 2, completing West Bengal's two-phase election.",
      },
      {
        phase: 'Results',
        event: 'Vote Counting & Result',
        date: 'May 4, 2026',
        status: 'upcoming',
        seats: 294,
        description: 'All 294 seats counted simultaneously. Results expected to be declared by evening.',
      },
    ],
    color: 'from-green-500 to-emerald-600',
    light: 'bg-green-50 border-green-200',
    accent: 'text-green-700',
  },
];

export const OTHER_STATES = [
  { state: 'Assam', seats: 126, date: 'Apr 23 & 29, 2026', result: 'May 4, 2026', status: 'completed' },
  { state: 'Kerala', seats: 140, date: 'Apr 23, 2026', result: 'May 4, 2026', status: 'completed' },
  { state: 'Puducherry', seats: 30, date: 'Apr 23, 2026', result: 'May 4, 2026', status: 'completed' },
];

// ─── Candidate Data ────────────────────────────────────────────────────────────
export const CANDIDATES_BY_STATE = {
  'Tamil Nadu': [
    {
      name: 'M. K. Stalin',
      party: 'DMK',
      partyColor: '#E53935',
      constituency: 'Kolathur',
      position: 'Chief Minister (Incumbent)',
      symbol: '🌅',
      votes2021: '78,432',
      status: 'incumbent',
    },
    {
      name: 'Edappadi K. Palaniswami',
      party: 'AIADMK',
      partyColor: '#1E88E5',
      constituency: 'Edappadi',
      position: 'Leader of Opposition',
      symbol: '🌿',
      votes2021: '66,201',
      status: 'opposition',
    },
    {
      name: 'K. Annamalai',
      party: 'BJP',
      partyColor: '#FF6D00',
      constituency: 'Aravakurichi',
      position: 'State President, BJP',
      symbol: '🪷',
      votes2021: '—',
      status: 'challenger',
    },
    {
      name: 'Seeman',
      party: 'NTK',
      partyColor: '#6D4C41',
      constituency: 'Harbour',
      position: 'National General Secretary',
      symbol: '⚡',
      votes2021: '—',
      status: 'challenger',
    },
  ],
  'West Bengal': [
    {
      name: 'Mamata Banerjee',
      party: 'AITC (TMC)',
      partyColor: '#1E88E5',
      constituency: 'Bhawanipur',
      position: 'Chief Minister (Incumbent)',
      symbol: '🌸',
      votes2021: '58,832',
      status: 'incumbent',
    },
    {
      name: 'Suvendu Adhikari',
      party: 'BJP',
      partyColor: '#FF6D00',
      constituency: 'Nandigram',
      position: 'Leader of Opposition',
      symbol: '🪷',
      votes2021: '77,246',
      status: 'opposition',
    },
    {
      name: 'Adhir Ranjan Chowdhury',
      party: 'INC',
      partyColor: '#43A047',
      constituency: 'Jiaganj',
      position: 'State Congress President',
      symbol: '✋',
      votes2021: '—',
      status: 'challenger',
    },
    {
      name: 'Biman Bose',
      party: 'CPI(M)',
      partyColor: '#B71C1C',
      constituency: 'Ballygunge',
      position: 'State Secretary, CPIM',
      symbol: '🔨',
      votes2021: '—',
      status: 'challenger',
    },
  ],
};

// ─── Constituency Map Data ─────────────────────────────────────────────────────
/** Key contested seats with candidate info. Used by ConstituencyFinder. */
export const KEY_SEATS = {
  'Tamil Nadu': {
    Kolathur: { candidate: 'M. K. Stalin (DMK)', status: 'Voted — Apr 23, 2026' },
    Edappadi: { candidate: 'E. K. Palaniswami (AIADMK)', status: 'Voted — Apr 23, 2026' },
    Aravakurichi: { candidate: 'K. Annamalai (BJP)', status: 'Voted — Apr 23, 2026' },
    'Coimbatore South': { candidate: 'Contested (BJP vs DMK)', status: 'Voted — Apr 23, 2026' },
    Harbour: { candidate: 'Seeman (NTK)', status: 'Voted — Apr 23, 2026' },
  },
  'West Bengal': {
    Bhawanipur: { candidate: 'Mamata Banerjee (AITC)', status: 'Voted — Apr 23, 2026' },
    Nandigram: { candidate: 'Suvendu Adhikari (BJP)', status: 'Voted — Apr 29, 2026' },
    Ballygunge: { candidate: 'Biman Bose (CPIM)', status: 'Voted — Apr 23, 2026' },
    'Howrah North': { candidate: 'Contested', status: 'Voted — Apr 29, 2026' },
    Asansol: { candidate: 'Contested (TMC vs BJP)', status: 'Voted — Apr 29, 2026' },
  },
};

/** Map center + zoom for each state. Uses Google Maps {lat, lng} format. */
export const STATE_VIEWS = {
  'Tamil Nadu': { center: { lat: 10.9, lng: 78.2 }, zoom: 7 },
  'West Bengal': { center: { lat: 22.9, lng: 87.7 }, zoom: 7 },
};

// ─── FAQ Data ──────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: 'Am I eligible to vote in India?',
    answer:
      'You are eligible if you are an Indian citizen, aged 18 or above on the qualifying date (1 January of the election year), and are enrolled in the electoral roll of your constituency. NRIs holding an Indian passport are also eligible to vote in person at their registered constituency.',
  },
  {
    question: 'What documents do I need at the polling booth?',
    answer:
      'Your Voter ID (EPIC card) is the primary document. If unavailable, the ECI accepts 12 alternate IDs: Aadhaar Card, PAN Card, Passport, Driving Licence, MNREGA Job Card, Smart Card, Pension Document, Service Identity Card, Bank / Post Office Passbook with photo, Health Insurance Smart Card, or a certificate issued by a Gazetted Officer.',
  },
  {
    question: 'How does an Electronic Voting Machine (EVM) work?',
    answer:
      'An EVM has two units: a Control Unit held by the Presiding Officer and a Balloting Unit for the voter. The Presiding Officer enables the ballot; you press the button against your chosen candidate. The vote is stored in encrypted memory. EVMs are standalone, not connected to any network, making them tamper-resistant. Since 2013, every EVM is paired with a VVPAT machine.',
  },
  {
    question: 'What is VVPAT and how do I use it?',
    answer:
      'VVPAT (Voter Verifiable Paper Audit Trail) is a transparent box next to the EVM. After you press the vote button, a paper slip prints showing the candidate\'s name, party symbol, and serial number. The slip is visible for 7 seconds before it drops into a sealed box, allowing you to verify your vote was cast correctly.',
  },
  {
    question: 'What is the Model Code of Conduct (MCC)?',
    answer:
      'The MCC is a set of guidelines issued by the Election Commission of India once elections are announced. It prohibits the ruling government from announcing new schemes or transfers, regulates campaign spending, bans hate speech, and ensures a level playing field for all parties. Violations can be reported to the ECI at 1950 or via the cVIGIL app.',
  },
  {
    question: 'Can I vote if my name is not on the voter roll?',
    answer:
      'No. You must be on the electoral roll of the constituency where you wish to vote. You can check your registration at voters.eci.gov.in or the Voter Helpline (1950). To register or update your details, submit Form 6 (new registration) or Form 8 (corrections) through the National Voters Service Portal (NVSP).',
  },
];
