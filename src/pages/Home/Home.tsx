import { memo, Suspense, useEffect } from "react";
import { useBoundStore } from "../../store/store";
import { Link, useNavigate } from "react-router-dom";
import { TrackDetails } from "../../types/GlobalTypes";
import Loading from "./Loading";
import Section from "../../components/Section/Section";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import Song from "../../components/Song/Song";
import fallbacktoday from "../../assets/timely/icons8-timely-today.png";
import fallbackweekly from "../../assets/timely/icons8-timely-weekly.png";
import fallbackmonthly from "../../assets/timely/icons8-timely-monthly.png";
import fallbackyearly from "../../assets/timely/icons8-timely-yearly.png";
import { useQuery } from "@tanstack/react-query";
import { getTimelyData, getWidgetData } from "../../api/requests";
import { genres, timelyData } from "../../utils/utils";
import logo from "../../assets/sound-waves.png";
import songfallback from "../../assets/icons8-song-fallback.png";

export default function Home() {
  const changeGreeting = useBoundStore((state) => state.changeGreeting);
  const greeting = useBoundStore((state) => state.greeting);
  const setWidgetData = useBoundStore((state) => state.setWidgetData);
  const nowPlaying = useBoundStore((state) => state.nowPlaying);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setQueue = useBoundStore((state) => state.setQueue);
  const navigate = useNavigate();

  const { isPending } = useQuery({
    queryKey: ["widget"],
    queryFn: getWidgetData,
    select: (data) => setWidgetData(data.data),
  });

  const setGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 12) {
      changeGreeting("Shine bright like the sun ☀️");
    } else if (hour > 12 && hour <= 15) {
      changeGreeting("Keep your energy glowing 🌤");
    } else if (hour > 15 && hour <= 18) {
      changeGreeting("Let the golden hour inspire you 🌅");
    } else {
      changeGreeting("Rest under the sparkling stars 🌙");
    }
  };

  useEffect(() => {
    if (greeting === "") setGreeting();
    timelyData.forEach((obj: { id: number; timely: string }) => {
      getTimelyData(obj.id, obj.timely);
    });
  }, []);

  const Widget = memo(() => {
    const widget = useBoundStore((state) => state.home.widget);

    function setNowPlayingQueue(
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
      e.preventDefault();
      e.stopPropagation();
      if (widget) {
        setQueue({
          id: widget.id || "",
          name: widget.name || "",
          image: widget.image || [],
          songs: widget.songs || [],
        });
        setNowPlaying(widget.songs?.[0]);
        setIsPlaying(true);
      }
    }

    if (!widget) {
      return <p>No widget data available</p>;
    }

    return (
      <div className="h-auto max-h-max w-full px-3.5">
        <section className="relative z-0 mx-auto my-3 mb-7 flex h-80 w-full flex-col overflow-hidden rounded-2xl bg-transparent sm:flex-row">
          <img
            src={widget.image?.[2]?.url || songfallback}
            alt="img"
            width={320}
            height={320}
            className="h-auto w-auto flex-shrink-0 bg-neutral-700 sm:z-10 sm:h-[320px] sm:w-[320px] sm:rounded-xl"
            onClick={() => widget.id && navigate(`/playlists/${widget.id}`)}
          />
          <div className="absolute right-2.5 top-[105px] z-20 flex h-auto w-[95%] items-end justify-between sm:left-0 sm:top-[268px] sm:h-12 sm:w-[320px] sm:justify-end sm:p-2 md:p-2 md:py-1">
            <p className="left-0 top-0 line-clamp-1 h-auto w-[80%] pl-1 text-xl font-bold text-white sm:hidden">
              {widget.name}
            </p>
            <button
              style={{ outline: "none", border: "1px solid #000" }}
              onClick={(e) => (nowPlaying.isPlaying ? setIsPlaying(false) : setNowPlayingQueue(e))}
              className="rounded-full bg-emerald-500 p-2"
            >
              <img
                src={nowPlaying.isPlaying ? pause : play}
                alt={nowPlaying.isPlaying ? "pause" : "play"}
                className="h-[28px] w-[28px]"
              />
            </button>
          </div>
          <ul
            id="widget-container"
            className="absolute bottom-1.5 left-1.5 h-[158px] w-[96.5%] list-none overflow-x-hidden overflow-y-scroll rounded-xl bg-neutral-900 sm:static sm:ml-3 sm:mt-0 sm:h-full"
          >
            {widget.songs?.length > 0 ? (
              widget.songs.map((song: TrackDetails, i: number) => (
                <Song {...song} key={i} />
              ))
            ) : (
              <p className="m-auto my-[12.5%] text-center text-xl text-neutral-500 sm:my-[135px]">
                No songs here...T_T
              </p>
            )}
          </ul>
        </section>
      </div>
    );
  });

  const TimelyPlaylists = memo(() => {
    const { monthly, yearly, weekly, today } = useBoundStore((state) => state.home.timely);

    const playlists = [
      { id: today.id, img: today.image?.[0]?.url || fallbacktoday, label: "Trending today", color: "yellow" },
      { id: weekly.id, img: weekly.image?.[0]?.url || fallbackweekly, label: "Top weekly", color: "teal" },
      { id: monthly.id, img: monthly.image?.[0]?.url || fallbackmonthly, label: "Best of the month", color: "rose" },
      { id: yearly.id, img: yearly.image?.[0]?.url || fallbackyearly, label: "Yearly throwback", color: "purple" },
    ];

    return (
      <div className="mx-auto my-4 mt-6 grid h-auto w-full grid-cols-2 grid-rows-2 gap-3 px-3.5 sm:gap-5">
        {playlists.map(({ id, img, label, color }, index) => (
          <Link
            to={`/playlists/${id}`}
            key={index}
            className={`flex h-12 w-full items-center justify-start overflow-hidden rounded-md bg-neutral-800 shadow-md transition-all ease-linear hover:text-${color}-500 hover:shadow-lg hover:shadow-${color}-500 sm:h-full`}
          >
            <img
              src={img}
              alt="img"
              width={56}
              height={56}
              className="h-full w-12 sm:w-14"
            />
            <p className={`sm:text-md p-3.5 px-3 text-left text-xs font-semibold text-${color}-400 sm:px-4 sm:text-sm`}>
              {label}
            </p>
          </Link>
        ))}
      </div>
    );
  });

  const HomeComponent = () => {
    return (
      <div className="h-auto w-full scroll-smooth bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-black via-neutral-950 to-neutral-700">
        <div className="h-auto max-h-max w-full pt-2 xl:w-full">
          <div className="-mb-0.5 flex h-auto w-full items-center justify-between px-4">
            <h1 className="text-left text-2xl font-semibold text-white animate-pulse">
              {greeting}
            </h1>
            <img
              loading="lazy"
              src={logo}
              alt="logo"
              className="-mb-0.5 rounded-full"
            />
          </div>
          <Widget />
          <h1 className="-my-1 px-4 text-left text-xl font-semibold text-white">
            Timely Tracks
          </h1>
          <TimelyPlaylists />
          <div className="h-auto max-h-max w-full pb-28 sm:pb-14">
            {genres.map((genre) => (
              <Section genre={genre} key={genre} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const DataComponent = () => {
    if (isPending) {
      throw new Promise((resolve) => setTimeout(resolve, 0));
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
