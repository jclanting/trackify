import Navbar from "@/components/Navbar";
import PreviewCard from "@/components/PreviewCard";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typography";

const Home = () => {
  return (
    <div className="flex flex-col px-12 py-10 gap-5">
      <H3>Browse Tracklists</H3>
      <Input type="text" placeholder="Search for artists or events" className="w-1/3 border-2" />
      <div className="grid grid-cols-4 gap-y-6">
        <PreviewCard 
          artistImg="/images/illenium.jpeg"
          artist="ILLENIUM"
          event="Electric Daisy Carnival Las Vegas"
          date={new Date(2024, 4, 17)}
          user="Piinoy"
          identifiedTracks={56}
          totalTracks={59}
        />
        <PreviewCard  
          artistImg="/images/calvin_harris.jpg"
          artist="Calvin Harris"
          event="Ultra Music Festival Miami"
          date={new Date(2024, 2, 24)}
          user="Piinoy"
          identifiedTracks={28}
          totalTracks={28}
        />
        <PreviewCard  
          artistImg="/images/porter_robinson.png"
          artist="Porter Robinson"
          event="Lights All Night"
          date={new Date(2022, 11, 29)}
          user="Piinoy"
          identifiedTracks={74}
          totalTracks={78}
        />
        <PreviewCard  
          artistImg="/images/crankdat.jpg"
          artist="Crankdat"
          event="Lost Lands Festival"
          date={new Date(2024, 8, 21)}
          user="Piinoy"
          identifiedTracks={84}
          totalTracks={91}
        />
        <PreviewCard  
          artistImg="/images/galantis.jpg"
          artist="Galantis"
          event="Lollapalooza Chicago"
          date={new Date(2024, 7, 2)}
          user="Piinoy"
          identifiedTracks={52}
          totalTracks={52}
        />
        <PreviewCard  
          artistImg="/images/alesso.jpg"
          artist="Alesso"
          event="Tomorrowland Weekend 1"
          date={new Date(2024, 6, 21)}
          user="Piinoy"
          identifiedTracks={32}
          totalTracks={37}
        />
        <PreviewCard  
          artistImg="/images/martin_garrix.jpeg"
          artist="Martin Garrix"
          event="Zenless Zone Zero"
          date={new Date(2024, 7, 23)}
          user="Piinoy"
          identifiedTracks={64}
          totalTracks={67}
        />
        <PreviewCard  
          artistImg="/images/tiesto.jpg"
          artist="Tiësto"
          event="Electric Zoo"
          date={new Date(2023, 8, 3)}
          user="Piinoy"
          identifiedTracks={48}
          totalTracks={48}
        />
      </div>
    </div>
  )
}

export default Home;
