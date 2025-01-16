import { useState, useEffect, useRef } from "react";
import { useBoundStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import WaveSurfer from "wavesurfer.js";
import secondsToHMS from "../../utils/utils";
import { TrackDetails } from "../../types/GlobalTypes";
import down from "../../assets/down.svg";
import favorite from "../../assets/icons8-heart.svg";
import favorited from "../../assets/icons8-favorited.svg";
import add from "../../assets/icons8-addplaylist-28.svg";
import replay from "../../assets/replay.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import shuffling from "../../assets/icons8-shuffle-activated.svg";
import previous from "../../assets/previous.svg";
import next from "../../assets/next.svg";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import songfallback from "../../assets/icons8-song-fallback.png";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_NOW_PLAYING_URL, SPOTIFY_AUTH_URL} from "/spotifyConfig"; // Import the Spotify configuration

export default function MobilePlayer() {
  const library = useBoundStore((state) => state.library);
  const nowPlaying = useBoundStore((state) => state.nowPlaying);
  const setShowPlayer = useBoundStore((state) => state.setShowPlayer);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const favorites = useBoundStore((state) => state.favorites);
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const removeFavorite = useBoundStore((state) => state.removeFavorite);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [trackThumbnail, setTrackThumbnail] = useState<string>(songfallback);

  // Format time for the progress bar
  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  // Get access token from Spotify API
  async function getSpotifyAccessToken() {
    const response = await fetch(SPOTIFY_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
    });
    const data = await response.json();
    return data.access_token;
  }

  // Fetch the currently playing track's details from Spotify API
  async function fetchNowPlaying() {
    const token = await getSpotifyAccessToken();
    const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const trackData = await response.json();
      if (trackData?.item) {
        setTrackThumbnail(trackData.item?.album?.images[0]?.url || songfallback);
      }
    }
  }

  useEffect(() => {
    if (nowPlaying.track?.id) {
      fetchNowPlaying();
    }
  }, [nowPlaying.track?.id]);

  // Play the song
  function handlePlay(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.play();
    setIsPlaying(true);
  }

  // Pause the song
  function handlePause(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.pause();
    setIsPlaying(false);
  }

  // Handle next track logic
  function playOrder() {
    if (isShuffling === false) {
      const songIndex = nowPlaying.queue.songs?.findIndex(
        (song: TrackDetails) => song.id === nowPlaying.track?.id
      );
      songIndex && setNowPlaying(nowPlaying.queue.songs[songIndex + 1]);
    } else {
      const randomIndex = Math.floor(Math.random() * nowPlaying.queue.songs?.length);
      setNowPlaying(nowPlaying.queue.songs[randomIndex]);
    }
  }

  useEffect(() => {
    if (nowPlaying.track?.id) {
      wavesurfer.current = WaveSurfer.create({
        container: "#mobileWave",
        autoplay: true,
        autoScroll: true,
        backend: "WebAudio",
        dragToSeek: true,
        hideScrollbar: true,
        mediaControls: true,
        waveColor: "#333",
        progressColor: "#10B981",
        fillParent: true,
        barGap: 1,
        barWidth: 2,
        minPxPerSec: 3,
        normalize: true,
        height: 50,
        barRadius: 10,
        duration: Number(nowPlaying.track?.duration),
        url: nowPlaying.track?.downloadUrl[4]?.url,
      });

      wavesurfer.current?.on("finish", () => {
        playOrder();
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [nowPlaying.track?.id]);

  return (
    <div
      className={`fixed left-0 z-10 flex h-full w-full flex-col items-start justify-start overflow-x-hidden overflow-y-scroll bg-black transition-all ease-in-out ${
        nowPlaying.isMobilePlayer ? "translate-y-0" : "translate-y-full"
      } sm:hidden`}
    >
      <button
        type="button"
        style={{
          border: "none",
          outline: "none",
        }}
        onClick={() => setShowPlayer(false)}
        className="absolute right-2 top-2 rounded-full bg-black p-1"
      >
        <img src={down} alt="down" className="h-[28px] w-[28px]" />
      </button>
      <img
        src={trackThumbnail}
        onError={(e) => (e.currentTarget.src = songfallback)}
        alt="image"
        width={500}
        height={500}
        className="mx-auto h-[500px] w-[500px] rounded-xl rounded-t-lg bg-fixed"
      />
      <div className="flex h-auto w-full flex-col items-center justify-start invert-0">
        <div className="flex h-auto w-full justify-between">
          <div className="line-clamp-3 flex h-auto w-[75%] flex-col items-start text-ellipsis p-3 px-4">
            <h2 className="text-xl font-semibold text-white">{nowPlaying.track?.name}</h2>
            <p className="text-md line-clamp-1 w-full overflow-hidden whitespace-nowrap text-neutral-500">
              {nowPlaying.track?.artists.primary.map((artist: any) => artist.name).join(", ")}
            </p>
          </div>
          <div className="flex h-14 w-[20%] items-center justify-evenly">
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              onClick={(e) => revealTrackMenu(e)}
              className={`-ml-3 border-none bg-transparent p-0 outline-none ${
                !playlist ? "block" : "hidden"
              }`}
            >
              <img
                src={add}
                alt="add"
                className="mb-0.5 h-[25px] w-[25px] bg-transparent"
              />
            </button>
            {favorites.songs?.some((song) => song?.id === nowPlaying.track?.id) ? (
              <button
                type="button"
                onClick={() =>
                  nowPlaying.track && removeFavorite(nowPlaying.track?.id)
                }
                style={{
                  border: "none",
                  outline: "none",
                }}
                className="mx-3 border-none bg-transparent p-0 outline-none"
              >
                <img
                  src={favorited}
                  alt="favorite"
                  className="h-[30px] w-[30px] bg-transparent"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  nowPlaying.track && setFavoriteSong(nowPlaying.track)
                }
                style={{
                  border: "none",
                  outline: "none",
                }}
                className="mx-3 border-none bg-transparent p-0 outline-none"
              >
                <img
                  src={favorite}
                  alt="favorite"
                  className="h-[30px] w-[30px] bg-transparent"
                />
              </button>
            )}
          </div>
        </div>
        {/* Progress */}
        <div className="mb-6 flex h-16 w-[90%] items-center justify-between lg:w-[500px] xl:w-[700px]">
          <p className="mr-2 h-full w-[10%] pt-9 text-[12px] text-white">
            {currentTime ? formatTime(currentTime) : "0:00"}
          </p>
          {/* Waveform */}
          <div className="-mb-4 flex h-full w-[80%] items-center justify-center overflow-hidden pt-4 lg:w-[90%]">
            <div id="mobileWave" className="-mt-3 h-full w-full" />
          </div>
          <p className="h-full w-[10%] pl-2 pt-9 text-[12px] text-white">
            {nowPlaying.track?.duration
              ? secondsToHMS(Number(nowPlaying.track?.duration))
              : ""}
          </p>
        </div>
      </div>
      <div className="mx-auto flex w-[85%] items-center justify-around py-4 transition-all ease-out">
        {isShuffling ? (
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
            onClick={(e) => {
              e.stopPropagation();
              setIsShuffling(false);
            }}
            disabled={nowPlaying.queue.songs?.length === 0}
          >
            <img
              src={shuffling}
              alt="shuffling"
              className="h-[25px] w-[25px] bg-transparent"
            />
          </button>
        ) : (
          <button
            type="button"
            style={{
              border: "none",
              outline: "none",
            }}
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.7]"
            onClick={(e) => {
              e.stopPropagation();
              setIsShuffling(true);
            }}
            disabled={nowPlaying.queue.songs?.length === 0}
          >
            <img
              src={shuffle}
              alt="shuffle"
              className="h-[25px] w-[25px] bg-transparent"
            />
          </button>
        )}
        <button
          type="button"
          onClick={handlePlay}
          style={{
            border: "none",
            outline: "none",
          }}
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed"
        >
          <img
            src={play}
            alt="play"
            className="h-[28px] w-[28px] bg-transparent"
          />
        </button>
        <button
          type="button"
          onClick={handlePause}
          style={{
            border: "none",
            outline: "none",
          }}
          className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed"
        >
          <img
            src={pause}
            alt="pause"
            className="h-[28px] w-[28px] bg-transparent"
          />
        </button>
      </div>
    </div>
  );
}
