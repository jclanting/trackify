"use client"
import { CircleUser } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { getUsername } from "@/lib/firebase/usernameService";

import { Button } from "./ui/button";

const Navbar = () => {

  const { currentUser, userLoggedIn, signOut, forceUpdate } = useAuth()
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  console.log(currentUser)

  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser?.uid) {
        const fetchedUsername = await getUsername(currentUser.uid)
        setUsername(fetchedUsername)
      }
    }

    fetchUsername()
  }, [currentUser, forceUpdate])

  const handleSignOut = async () => {
    await signOut()
    router.push("/sign-in")
  }

  if (pathname === "/sign-in" || 
      pathname === "/sign-up" ||
      pathname === "/select-username"
    ) {
    return null;
  }

  return (
    <nav className="flexBetween navbar">
      <div className="flexStart gap-8">
        <h1 className="text-lg font-bold">trackify</h1>
        <div className="flexBetween gap-4">
          <Button
            variant="link" 
            className="text-slate-500 p-0" 
            onClick={() => router.push("/")}
          >
          Browse
          </Button>
          <Button
            variant="link" 
            className="text-slate-500 p-0" 
            onClick={() => router.push("/library")}
          >
          Library
          </Button>
        </div>
      </div>
      {userLoggedIn && currentUser?.emailVerified ? 
        <div className="flex gap-x-6 items-center">
          <p>{username}</p> 
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
        : 
        <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
      }
    </nav>
  )
}

export default Navbar;
