import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves user progress to Firestore
 * @param {string} userId - Firebase Auth UID
 * @param {string} path - Firestore document path (e.g., 'progress')
 * @param {Object} data - Data to save
 */
export const saveUserData = async (userId, path, data) => {
  if (!db || !userId) return;
  try {
    const docRef = doc(db, 'users', userId, 'data', path);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving data to Firestore', error);
  }
};

/**
 * Fetches user progress from Firestore
 * @param {string} userId - Firebase Auth UID
 * @param {string} path - Firestore document path
 * @returns {Promise<Object|null>} Data or null if not found
 */
export const getUserData = async (userId, path) => {
  if (!db || !userId) return null;
  try {
    const docRef = doc(db, 'users', userId, 'data', path);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching data from Firestore', error);
    return null;
  }
};
