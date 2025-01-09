import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RiSoundcloudLine, RiSpotifyLine, RiYoutubeLine } from "react-icons/ri";

import { getArtistData, getArtistNames } from "@/lib/firebase/idService";

import { Button } from "./ui/button";

interface TrackProps {
  id: string,
  index: number,
  name: string,
  artists: string[],
  timestamp: number,
  youtubeUrl?: string,
  spotifyUrl?: string,
  soundcloudUrl?: string
}

interface TrackCardMediaButtonProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  url: string
}

const CardMediaButton: React.FC<TrackCardMediaButtonProps> = ({ Icon, url }) => {
  return (
    <Button variant="outline" size="icon" className="border-2">
      <a href={url} target="_blank">
        <Icon className="!size-6" />
      </a>
    </Button>
  )
}

const TrackCard : React.FC<TrackProps> = ({ index, name, artists, timestamp, youtubeUrl, spotifyUrl, soundcloudUrl }) => {

  const [artistNames, setArtistNames] = useState<string[]>([])
  const [timestampFormatted, setTimestampFormatted] = useState<string>("")

  useEffect(() => {
    const loadTrackCardInfo = async () => {
      const artistNames = await getArtistNames(artists)
      setArtistNames(artistNames)

      const ts = format(new Date(0).setSeconds(timestamp), "m:ss");
      setTimestampFormatted(ts)
    }
    
    loadTrackCardInfo()
  }, [])

  return (
    <div className="flex flex-col justify-center w-1/2 h-20 p-4 mb-1 border-2 border-slate-200 rounded-md">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col items-center text-slate-500">
            <h2 className="text-2xl font-semibold">{index}</h2>
            <p className="text-sm">{timestampFormatted}</p>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-slate-500">{artistNames.join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {youtubeUrl && <CardMediaButton Icon={RiYoutubeLine} url={youtubeUrl} />}
          {spotifyUrl && <CardMediaButton Icon={RiSpotifyLine} url={spotifyUrl} />}
          {soundcloudUrl && <CardMediaButton Icon={RiSoundcloudLine} url={soundcloudUrl} />}
        </div>
      </div>
    </div>
  )
}

export default TrackCard