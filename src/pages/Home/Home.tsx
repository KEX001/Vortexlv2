import { memo, Suspense, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { ActivityType, TrackDetails } from "../../types/GlobalTypes";
import Loading from "./Loading";
import Section from "../../components/Section/Section";
import playIcon from "../../assets/icons8-play.svg";
import pauseIcon from "../../assets/icons8-pause.svg";
import Song from "../../components/Song/Song";
import { useQuery } from "@tanstack/react-query";
import { getTimelyData, getWidgetData } from "../../api/requests";
import { genres, timelyData } from "../../utils/utils";
import logo from "../../assets/sound-waves.png";
import songfallback from "../../assets/icons8-song-fallback.png";
import notifIcon from "../../assets/bell-svgrepo-com.svg";
import fallbackImages from "../../assets/timely/fallbackImages";

export default function Home() {
  const { changeGreeting, greeting, setWidgetData, nowPlaying, setIsPlaying, setNowPlaying, setQueue, notifications, setNotifications } = useBoundStore(state => ({
    changeGreeting: state.changeGreeting,
    greeting: state.greeting,
    setWidgetData: state.setWidgetData,
    nowPlaying: state.nowPlaying,
    setIsPlaying: state.setIsPlaying,
    setNowPlaying: state.setNowPlaying,
    setQueue: state.setQueue,
    notifications: state.notifications,
    setNotifications: state.setNotifications,
  }));
  const navigate = useNavigate();
  const { isPending } = useQuery({
    queryKey: ["widget"],
    queryFn: getWidgetData,
    select: data => setWidgetData(data.data),
  });

  useEffect(() => {
    if (!greeting) setGreeting();
    timelyData.forEach(obj => getTimelyData(obj.id, obj.timely));
  }, [greeting]);

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 12) changeGreeting("Good morning");
    else if (hour > 12 && hour <= 15) changeGreeting("Good afternoon");
    else if (hour > 15 && hour <= 18) changeGreeting("Good evening");
    else changeGreeting("Good night");
  };

  const Activity = ({ message }: ActivityType) => (
    <li className="flex items-center justify-start p-2 text-xs font-semibold text-neutral-300">
      {message}
    </li>
  );

  const toggleNotifs = () => setNotifications(!notifications);

  const Widget = memo(() => {
    const widget = useBoundStore(state => state.home.widget);

    function setNowPlayingQueue(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      setQueue({ id: widget?.id || "", name: widget?.name || "", image: widget?.image || [], songs: widget?.songs || [] });
      widget && setNowPlaying(widget.songs[0]);
      setIsPlaying(true);
    }

    return (
      <section className="relative w-full h-auto flex flex-col md:flex-row overflow-hidden rounded-2xl bg-transparent shadow-lg">
        <img
          src={widget?.image?.[2]?.url || songfallback}
          alt="Widget Image"
          className="w-full h-auto rounded-xl"
          onClick={() => widget && navigate(`/playlists/${widget.id}`)}
        />
        <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2">
          <p className="text-xl font-bold text-white">{widget?.name}</p>
          <button
            className="p-2 bg-emerald-500 rounded-full"
            onClick={nowPlaying.isPlaying ? () => setIsPlaying(false) : setNowPlayingQueue}
          >
            <img src={nowPlaying.isPlaying ? pauseIcon : playIcon} alt={nowPlaying.isPlaying ? "Pause" : "Play"} />
          </button>
        </div>
        <ul className="absolute bottom-0 left-0 w-full h-[150px] bg-black bg-opacity-60 overflow-auto rounded-b-xl">
          {widget?.songs?.length > 0 ? widget.songs.map((song, i) => (
            <Song key={i} {...song} />
          )) : <p className="text-center text-neutral-500">No songs here...T_T</p>}
        </ul>
      </section>
    );
  });

  const TimelyPlaylists = memo(() => {
    const { today, weekly, monthly, yearly } = useBoundStore(state => state.home.timely);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
        {[
          { label: "Trending today", data: today, color: "yellow", fallback: fallbackImages.today },
          { label: "Top weekly", data: weekly, color: "teal", fallback: fallbackImages.weekly },
          { label: "Best of the month", data: monthly, color: "rose", fallback: fallbackImages.monthly },
          { label: "Yearly throwback", data: yearly, color: "purple", fallback: fallbackImages.yearly },
        ].map(({ label, data, color, fallback }, idx) => (
          <Link key={idx} to={`/playlists/${data.id}`} className={`flex items-center space-x-3 p-4 bg-neutral-800 rounded-md hover:bg-${color}-500 transition-all`}>
            <img src={data.image?.[0]?.url || fallback} alt="playlist" className="w-14 h-14 object-cover rounded-md" />
            <p className={`text-${color}-400 text-sm font-semibold`}>{label}</p>
          </Link>
        ))}
      </div>
    );
  });

  const HomeComponent = () => {
    const recents = useBoundStore(state => state.recents);

    return (
      <div className="bg-gradient-to-t from-black via-neutral-900 to-neutral-700 h-full">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold text-white">{greeting}</h1>
          <div className="relative">
            <button onClick={toggleNotifs} className="p-2 bg-transparent">
              <img src={notifIcon} alt="Notification Icon" className="h-6 w-6" />
              {recents.activity.length > 0 && !notifications && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>
            {notifications && (
              <ul className="absolute right-0 top-8 bg-neutral-900 rounded-b-xl w-48 p-2 space-y-2">
                {recents.activity.length > 0 ? recents.activity.map((message, i) => (
                  <Activity key={i} message={message} />
                )) : <div className="text-center">No activities yet!</div>}
              </ul>
            )}
          </div>
          <img src={logo} alt="Logo" className="rounded-full" />
        </div>
        <Widget />
        <h2 className="text-xl font-semibold text-white p-4">Timely Tracks</h2>
        <TimelyPlaylists />
        {genres.map(genre => (
          <Section genre={genre} key={genre} />
        ))}
      </div>
    );
  };

  const DataComponent = () => {
    if (isPending) {
      throw new Promise(resolve => setTimeout(resolve, 0));
    } else {
      return <HomeComponent />;
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />
    </Suspense>
  );
}
