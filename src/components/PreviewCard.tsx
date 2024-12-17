import { format } from "date-fns";
import { Calendar, MapPin, Music, Share, User } from "lucide-react";
import Image from "next/image";

import { P } from "./ui/typography";

interface PreviewCardProps {
  artistImg: string,
  artist: string,
  event: string,
  date: Date,
  user: string,
  identifiedTracks: number,
  totalTracks: number
}

interface CardInfoProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  text: string
}

const CardInfo: React.FC<CardInfoProps> = ({ Icon, text }) => {
  return (
    <div className="flex gap-5">
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="text-xs truncate max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
        {text}
      </div>
    </div>
  )
}

const PreviewCard : React.FC<PreviewCardProps> = ({ artistImg, artist, event, date, user, identifiedTracks, totalTracks }) => {
  return (
    <div className="flex flex-col w-72 h-[25rem] p-6 border border-slate-200 rounded-md drop-shadow transition-all ease-in-out duration-100 hover:scale-105 hover:shadow-lg">
      <Share className="absolute w-5 h-5 top-4 right-4" />
      <div className="flex flex-col">
        <div className="flex justify-center w-full h-full">
          <div className="relative w-36 h-36 m-6 drop-shadow">
            <Image
              src={artistImg}
              alt="Artist"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 my-3">
          <CardInfo Icon={Music} text={artist} />
          <CardInfo Icon={MapPin} text={event} />
          <CardInfo Icon={Calendar} text={format(date, "MM/dd/yyyy")} />
          <CardInfo Icon={User} text={user} />
        </div>
        <div className="flex justify-center text-xs my-2">
          {identifiedTracks}/{totalTracks} tracks
        </div>
      </div>
    </div>
  )
}

export default PreviewCard