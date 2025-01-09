import { format } from "date-fns";
import {
  Calendar, EllipsisVertical, ExternalLink, MapPin, Music, Share2, User
} from "lucide-react";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";

import { Button } from "./ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "./ui/dropdown-menu";

interface PreviewCardProps {
  id: string,
  artistImg: string,
  artist: string,
  event: string,
  date: Date,
  user: string,
  identifiedTracks: number,
  totalTracks: number,
  onClick?: () => void
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

const PreviewCard : React.FC<PreviewCardProps> = ({ id, artistImg, artist, event, date, user, identifiedTracks, totalTracks, onClick }) => {

  const { toast } = useToast()

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Tracklist copied to clipboard!",
      description: "Share this link with others!",
      duration: 5000
    })
    navigator.clipboard.writeText(`localhost:3000/tracklists/${id}`)
  }

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`http://localhost:3000/tracklists/${id}`, "_blank")
  }

  return (
    <div onClick={onClick} className="flex flex-col w-72 h-[25rem] p-6 border border-slate-200 rounded-md drop-shadow transition-all ease-in-out duration-100 hover:scale-105 hover:shadow-lg">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute w-8 h-8 top-3 right-3 p-0 focus-visible:ring-0 focus:ring-0 focus:outline-none focus-visible:ring-offset-0"
          onClick={handleShareClick}
        >
          <EllipsisVertical className="!size-5"/>
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleShareClick}>
            <Share2 />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenClick}>
            <ExternalLink />
            <span>Open in new tab</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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