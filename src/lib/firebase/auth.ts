import {
  createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification,
  signInWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, User, UserCredential
} from "firebase/auth";

import { auth } from "@/lib/firebase/config";

const googleProvider = new GoogleAuthProvider()

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(userCredential.user)
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      window.alert("Please verify your email address.")
      throw new Error("Please verify your email address.")
    }
    updateUser(userCredential.user)
    return userCredential;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("An unknown error occurred")
  }
}

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider)
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