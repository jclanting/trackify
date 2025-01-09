import { doc, getDoc } from "firebase/firestore";

import { db } from "./config";

export const getTracklistData = async (tracklistId: string) => {
  const tracklistRef = doc(db, "tracklists", tracklistId)
  const tracklistDoc = await getDoc(tracklistRef)
  
  if (tracklistDoc.exists()) {
    return tracklistDoc.data()
  }
}

export const getArtistData = async (artistId: string) => {
  const artistRef = doc(db, "artists", artistId)
  const artistDoc = await getDoc(artistRef)
  
  if (artistDoc.exists()) {
    return artistDoc.data()
  }
}

export const getTrackData = async (trackId: string) => {
  const trackRef = doc(db, "tracks", trackId)
  const trackDoc = await getDoc(trackRef)

  if (trackDoc.exists()) {
    return trackDoc.data()
  }
}

export const getArtistNames = async (artistIds: string[]) => {
  const artistNames = await Promise.all(
    artistIds.map(async (artistId: string) => {
      const artistData = await getArtistData(artistId)
      return artistData?.name
    })
  )

  return artistNames
}
