"use client"
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PreviewCard from "@/components/PreviewCard";
import { H3 } from "@/components/ui/typography";
import { db } from "@/lib/firebase/config";
import { getUsername } from "@/lib/firebase/usernameService";

type Tracklist = {
  id: string,
  artistImg: string,
  artist: string,
  event: string,
  date: Date,
  user: string
}

const fetchTracklists = async (userId: string): Promise<Tracklist[]> => {
  const userTracklistsQuery = query(
    collection(db, "tracklists"),
    where("owner", "==", userId)
  )

  const querySnapshot = await getDocs(userTracklistsQuery)

  const tracklistsData = await Promise.all(
    querySnapshot.docs.map(async (tracklist) => {
      const tracklistData = tracklist.data()

      const artistRef = doc(db, "artists", tracklistData.artists[0])
      const artistDoc = await getDoc(artistRef)
      const artistData = artistDoc.data()

      const user = await getUsername(userId)

      return {
        id: tracklist.id,
        artistImg: artistData?.imgUrl,
        artist: artistData?.name,
        event: tracklistData?.eventName,
        date: tracklistData.eventDate.toDate(),
        user
      }
    })
  )

  return tracklistsData
}

const Library = () => {
  const [tracklists, setTracklists] = useState<Tracklist[]>([])
  const { currentUser } = getAuth()
  const router = useRouter()

  useEffect(() => {
    const loadTracklists = async () => {
      if (!currentUser) return

      try {
        const tracklistsData = await fetchTracklists(currentUser.uid)
        setTracklists(tracklistsData)
      } catch (error) {
        console.error("Failed to fetch tracklists:", error)
      }
    }

    loadTracklists()
  }, [currentUser])

  const handleCardClick = (tracklistId: string) => {
    router.push(`/tracklists/${tracklistId}`)
  }

  const tracklistCards = tracklists.map((tracklist) => (
    <PreviewCard
      key={tracklist.id}
      id={tracklist.id}
      artistImg={tracklist.artistImg}
      artist={tracklist.artist}
      event={tracklist.event}
      date={tracklist.date}
      user={tracklist.user}
      identifiedTracks={60}
      totalTracks={60}
      onClick={() => handleCardClick(tracklist.id)}
    />
  ))

  return (
    <div className="flex flex-col px-12 py-10 gap-5">
      <H3>Your Tracklists</H3>
      <div className="grid grid-cols-4 gap-y-6">
        {tracklistCards}
      </div>
    </div>
  )
}

export default Library
