"use client"
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { auth } from "@/lib/firebase/config";

interface AuthContextType {
  currentUser: User | null,
  userLoggedIn: boolean,
  loading: boolean,
  signOut: () => Promise<void>,
  updateUser: (user: User | null) => void
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => updateUser(user))
    return unsubscribe
  }, [])

  const updateUser = ( user: User | null ) => {
    if (user?.emailVerified) {
      setCurrentUser(user)
      setUserLoggedIn(true)
    } else {
      setCurrentUser(null)
      setUserLoggedIn(false)
    }
    setLoading(false)
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

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    signOut,
    updateUser
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthProvider
