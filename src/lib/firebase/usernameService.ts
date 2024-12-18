import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "./config";

export const isUsernameReserved = async (username: string) => {
  if (!username || username.trim() === "") {
    throw new Error("Empty username provided");
  }
  
  const usernameRef = doc(db, "usernames", username.toLowerCase())
  const usernameDoc = await getDoc(usernameRef)
  return usernameDoc.exists()
}

export const reserveUsername = async (username: string, uid: string) => {
  if (await isUsernameReserved(username)) {
    throw new Error("Username already taken")
  }

  const usernameRef = doc(db, "usernames", username.toLowerCase())
  await setDoc(usernameRef, { uid })

  const userRef = doc(db, "users", uid)
  await setDoc(userRef, { username: username }, { merge: true })
}

export const hasUsername = async (uid: string) => {
  const userRef = doc(db, "users", uid)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    return "username" in userDoc.data()
  }
}

export const getUsername = async (uid: string) => {
  const userRef = doc(db, "users", uid)
  const userDoc = await getDoc(userRef)
  
  if (userDoc.exists()) {
    return userDoc.data().username
  }
}