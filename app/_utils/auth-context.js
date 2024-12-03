'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup
  } from "firebase/auth";
  
  const AuthContext = createContext();
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, []);
  
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  
    const loginWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    };
  
    const loginWithGithub = () => {
      const provider = new GithubAuthProvider();
      return signInWithPopup(auth, provider);
    };
  
    const logout = () => signOut(auth);
  
    return (
      <AuthContext.Provider value={{ user, login, register, loginWithGoogle, loginWithGithub, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export const useAuth = () => useContext(AuthContext);