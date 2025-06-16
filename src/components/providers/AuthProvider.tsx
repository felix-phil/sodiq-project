"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext, { AuthContextType } from "@/contexts/AuthContext";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../firebase";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState<AuthContextType["user"]>(undefined);

  const login = useCallback((user: NonNullable<AuthContextType["user"]>) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(undefined);
  }, []);

  useEffect(() => {
    // Handles auto login and logout
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        console.log("User signed out");
        setUser(undefined);
        return;
      }

      try {
        const userRef = doc(db, `users/${firebaseUser.uid}`);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) throw new Error("User profile not found");

        const userData = userSnap.data();
        setUser(userData as AuthContextType["user"]);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const authMemo = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;