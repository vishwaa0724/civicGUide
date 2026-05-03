import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import PropTypes from 'prop-types';

const AuthContext = createContext();

/**
 * Custom hook to use AuthContext
 * @returns {Object} { user, loginWithGoogle, logout, loading }
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Provider to manage Firebase Auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!auth) {
      alert('Firebase Auth is not configured! Please add your Firebase configuration (VITE_FIREBASE_API_KEY, etc.) to the .env file to enable Google Sign-in.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Failed', error);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Failed', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    loginWithGoogle,
    logout
  }), [user, loading, loginWithGoogle, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
