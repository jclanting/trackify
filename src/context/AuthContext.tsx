"use client"
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react";

import { auth, db } from "@/lib/firebase/config";

interface AuthContextType {
  currentUser: User | null,
  userLoggedIn: boolean,
  loading: boolean,
  signOut: () => Promise<void>,
  updateUser: (user: User | null) => void,
  forceUpdate: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [, forceRender] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => updateUser(user))
    return unsubscribe
  }, [])

  const updateUser = async (user: User | null) => {
    if (user?.emailVerified) {
      await ensureEmailVerifiedInFirestore(user.uid)
      setCurrentUser(user)
      setUserLoggedIn(true)
    } else {
      setCurrentUser(null)
      setUserLoggedIn(false)
    }
    setLoading(false)
  }

  const ensureEmailVerifiedInFirestore = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists() && !userDoc.data().emailVerified) {
        await updateDoc(userRef, { emailVerified: true })
      }
    } catch (error) {
      console.error("Error ensuring email verification in Firestore:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setCurrentUser(null)
      setUserLoggedIn(false)
      setLoading(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("An unknown error occurred")
    }
  }

  const forceUpdate = () => forceRender()

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    signOut,
    updateUser,
    forceUpdate
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthProvider
