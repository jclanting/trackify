"use client"
import { format } from "date-fns";
import { use, useEffect, useState } from "react";

import TrackCard from "@/components/TrackCard";
import { H3 } from "@/components/ui/typography";
import { getArtistNames, getTrackData, getTracklistData } from "@/lib/firebase/idService";

type TracklistProps = {
  params: Promise<{ tracklistId: string }>
}

type Track = {
  id: string,
  artists: string[],
  name: string,
  timestamp: number,
  youtubeUrl?: string,
  spotifyUrl?: string,
  soundcloudUrl?: string
}

const buildTracklistTitle = async (tracklist: any): Promise<string> => {
  const artistIds = tracklist.artists
  const artistNames = await getArtistNames(artistIds)
  const eventDate = tracklist.eventDate.toDate()

  return `${artistNames.join(", ")} @ ${tracklist.eventName} - ${format(eventDate, "MM/dd/yyyy")}`
}

const buildTrackCards = async (tracks: Track[]) => {
  const trackCards = await Promise.all(
    tracks.map(async (track, index) => {
      const trackData = await getTrackData(track.id)
      return (
        <TrackCard
          key={trackData?.name}
          id={trackData?.name}
          index={index}
          name={trackData?.name}
          timestamp={track.timestamp}
          artists={trackData?.artists}
          youtubeUrl={trackData?.urls.youtube}
          spotifyUrl={trackData?.urls.spotify}
          soundcloudUrl={trackData?.urls.soundcloud}
        />
      )
    })
  )
  return trackCards
}


const Tracklist = ({ params } : TracklistProps) => {

  const [tracklist, setTracklist] = useState<any[]>([])
  const [trackCards, setTrackCards] = useState<any[]>([])
  const [tracklistTitle, setTracklistTitle] = useState<string>("")

  const { tracklistId } = use(params)

  useEffect(() => {
    const loadTracklist = async () => {
      try {
        const tracklistData = await getTracklistData(tracklistId)
        setTracklist(tracklistData)

        const title = await buildTracklistTitle(tracklistData)
        setTracklistTitle(title)

        const cards = await buildTrackCards(tracklistData?.tracks)
        setTrackCards(cards)
      } catch (error) {
        console.error("Failed to fetch tracklists:", error)
      }
    }

    loadTracklist()
  }, [tracklistId])
  
  return (
    <div className="flex flex-col px-12 py-10">
      <div className="items-center">
        <H3 className="mb-4">{tracklistTitle}</H3>
        {trackCards}
      </div>
    </div>
  )
}

export default Tracklist
