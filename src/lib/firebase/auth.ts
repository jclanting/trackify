import {
  createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification,
  signInWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, User, UserCredential
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth } from "@/lib/firebase/config";

import { db } from "./config";

const googleProvider = new GoogleAuthProvider()

const createUser = async (email: string, uid: string) => {
  const userRef = doc(db, "users", uid)

  await setDoc(userRef, {
    createdAt: serverTimestamp(),
    email: email,
    emailVerified: false
  })
}

const isUser = async (uid: string): Promise<boolean> => {
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)
    return userDoc.exists()
}

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(userCredential.user)
    await createUser(email, userCredential.user.uid)
    return userCredential
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("An unknown error occurred")
  }
}

export const signInWithEmail = async (email: string, password: string, updateUser: (user: User | null) => void): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if (!userCredential.user.emailVerified) {
      window.alert("Please verify your email address.")
      throw new Error("Please verify your email address.")
    }

    await updateUser(userCredential.user)
    return userCredential
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message)
      throw new Error(error.message)
    }
    console.error("An unknown error occurred")
    throw new Error("An unknown error occurred")
  }
}

export const signInWithUsername = async (username: string, password: string, updateUser: (user: User | null) => void): Promise<UserCredential> => {
  try {
    const usernameRef = doc(db, "usernames", username.toLowerCase())
    const usernameDoc = await getDoc(usernameRef)

    if (!usernameDoc.exists()) {
      throw new Error("Username not found")
    }

    const uid = usernameDoc.data().uid
    const userRef = doc(db, "users", uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User document not found")
    }

    if (userDoc.data().username !== username) {
      throw new Error("Invalid credentials")
    }

    const email = userDoc.data().email
    return await signInWithEmail(email, password, updateUser)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message)
      throw new Error(error.message)
    }
    console.error("An unknown error occurred")
    throw new Error("An unknown error occurred")
  }
}

export const signInWithGoogle = async (updateUser: (user: User | null) => void): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    if (userCredential.user.email) {
      const userExists = await isUser(userCredential.user.uid)
      if (!userExists) {
        await createUser(userCredential.user.email, userCredential.user.uid)
      }
    }
    await updateUser(userCredential.user)
    return userCredential
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("An unknown error occurred")
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};