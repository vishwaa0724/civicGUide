import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration loaded from environment variables.
 * Set VITE_FIREBASE_* vars in your .env file.
 * The app degrades gracefully if any variable is missing.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasConfig =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

/** Singleton analytics instance — null until async init resolves. */
let analyticsInstance = null;

// Initialise Firebase Analytics asynchronously; safely skipped if unavailable.
let app = null;
if (hasConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  isSupported()
    .then((supported) => {
      if (supported) analyticsInstance = getAnalytics(app);
    })
    .catch(() => {
      // Analytics unsupported in this environment (e.g. ad-blocker, Node.js)
    });
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

/**
 * Fire-and-forget analytics event logger.
 * Safe to call even when Firebase is not configured — it simply no-ops.
 *
 * @param {string} eventName - Snake_case GA4 event name
 * @param {Record<string, unknown>} [params] - Optional event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (!analyticsInstance) return;
  try {
    logEvent(analyticsInstance, eventName, params);
  } catch {
    // Never let analytics errors surface to the user
  }
}
