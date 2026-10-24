import { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value = {
    user,
    loading,
    signUp: (email, pw) => createUserWithEmailAndPassword(auth, email, pw),
    logIn: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    googleLogin: () => signInWithPopup(auth, googleProvider),
    logOut: () => signOut(auth),
     resetPassword: (email) => sendPasswordResetEmail(auth, email),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};