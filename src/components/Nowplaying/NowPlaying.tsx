import { useState, useEffect, useRef } from "react";
import { useBoundStore } from "../../store/store";
import { ArtistInSong, TrackDetails } from "../../types/GlobalTypes";
import songfallback from "../../assets/icons8-song-fallback.png";
import speaker from "../../assets/speaker-svgrepo.svg";
import favorite from "../../assets/icons8-heart.svg";
import favorited from "../../assets/icons8-favorited.svg";
import add from "../../assets/icons8-addplaylist-28.svg";
import high from "../../assets/volume-high.svg";
import vol from "../../assets/volume-min-svgrepo.svg";
import mute from "../../assets/mute-svgrepo-com.svg";
import replay from "../../assets/replay.svg";
import shuffle from "../../assets/icons8-shuffle.svg";
import random from "../../assets/icons8-shuffle-activated.svg";
import previous from "../../assets/previous.svg";
import next from "../../assets/next.svg";
import play from "../../assets/icons8-play.svg";
import pause from "../../assets/icons8-pause.svg";
import WaveSurfer from "wavesurfer.js";
import secondsToHMS from "../../utils/utils";
import tick from "../../assets/icons8-tick.svg";
import "../../App.css";

export default function NowPlaying() {
  const library = useBoundStore((state) => state.library);
  const nowPlaying = useBoundStore((state) => state.nowPlaying);
  const setFavoriteSong = useBoundStore((state) => state.setFavoriteSong);
  const favorites = useBoundStore((state) => state.favorites);
  const removeFavorite = useBoundStore((state) => state.removeFavorite);
  const setIsPlaying = useBoundStore((state) => state.setIsPlaying);
  const removeFromUserPlaylist = useBoundStore((state) => state.removeFromUserPlaylist);
  const setCreationTrack = useBoundStore((state) => state.setCreationTrack);
  const setRevealCreation = useBoundStore((state) => state.setRevealCreation);
  const isShuffling = useBoundStore((state) => state.isShuffling);
  const setNowPlaying = useBoundStore((state) => state.setNowPlaying);
  const setShowPlayer = useBoundStore((state) => state.setShowPlayer);
  const setIsShuffling = useBoundStore((state) => state.setIsShuffling);
  const setHistory = useBoundStore((state) => state.setHistory);
  const [currentTime, setCurrentTime] = useState(0);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const songIndex = nowPlaying.queue.songs?.findIndex((song: TrackDetails) => song.id === nowPlaying.track?.id);
  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(":");

  // Progress bar width calculation
  const progressBarWidth = nowPlaying.track?.duration
    ? (currentTime / Number(nowPlaying.track?.duration)) * 100
    : 0;

  // Function to update progress when seeking or playing
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const progressBar = e.currentTarget;
    const width = progressBar.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const newTime = (clickPosition / width) * Number(nowPlaying.track?.duration || 0);
    wavesurfer.current?.seekTo(newTime / Number(nowPlaying.track?.duration || 0));
  };

  useEffect(() => {
    switch (true) {
      case wavesurfer.current?.isPlaying() === false && nowPlaying.isPlaying === true:
        wavesurfer.current.play();
        break;
      case wavesurfer.current?.isPlaying() === true && nowPlaying.isPlaying === false:
        wavesurfer.current.pause();
        break;
    }
  }, [nowPlaying.isPlaying]);

  useEffect(() => {
    if (innerWidth > 640) {
      nowPlaying.track && setHistory(nowPlaying.track);
      wavesurfer.current = WaveSurfer.create({
        container: "#desktopWave",
        autoplay: true,
        autoScroll: true,
        backend: "WebAudio",
        dragToSeek: true,
        hideScrollbar: true,
        mediaControls: true,
        waveColor: "#333",
        progressColor: "#10B981", // You can adjust this color
        fillParent: true,
        barGap: 1,
        barWidth: 2,
        minPxPerSec: 1,
        height: 12,
        duration: Number(nowPlaying.track?.duration),
        url: nowPlaying.track?.downloadUrl[4]?.url,
      });
    }
    wavesurfer.current?.on("redrawcomplete", () => {
      setIsPlaying(true);
    });
    wavesurfer.current?.on("seeking", () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });
    wavesurfer.current?.on("timeupdate", () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });
    wavesurfer.current?.on("finish", () => {
      setIsPlaying(false);
      if (songIndex === -1) {
        setShowPlayer(false);
      } else {
        setNowPlaying(nowPlaying.queue.songs[songIndex + 1]);
      }
    });

    return () => {
      wavesurfer.current?.destroy();
      wavesurfer.current?.stop();
    };
  }, [nowPlaying.track?.id]);

  return (
    <div className="absolute bottom-0 hidden h-fit w-full justify-between bg-black sm:flex">
      <div className="flex h-full w-[30%] max-w-[300px] items-center justify-center p-2.5">
        <img
          src={nowPlaying.track?.image[2]?.url || songfallback}
          id="songImg"
          alt="song-img"
          onError={(e) => (e.currentTarget.src = songfallback)}
          className="mr-3 h-[50px] w-[50px] flex-shrink-0 rounded-md"
        />
        <div className="flex h-full w-full max-w-[300px] flex-col items-start justify-center overflow-hidden text-ellipsis">
          <h2 className="line-clamp-1 whitespace-nowrap text-sm text-white">
            {nowPlaying.track?.name}
          </h2>
          <p className="line-clamp-1 whitespace-nowrap text-xs text-neutral-400">
            {nowPlaying.track?.artists.all.map((artist: ArtistInSong) => artist.name)}
          </p>
        </div>
      </div>
      <div className="flex h-full w-auto flex-col items-center justify-evenly p-1.5 sm:w-[40%]">
        {/* Controls */}
        <div className="flex w-[250px] items-center justify-around pt-0.5">
          {/* Play, Pause, Previous, Next buttons */}
        </div>

        {/* Custom Progress Bar */}
        <div className="mt-1 flex h-5 w-[350px] items-center justify-between lg:w-[500px] xl:w-[700px]">
          <p className="h-full w-[50px] text-center text-[12px] text-white">
            {formatTime(currentTime)}
          </p>
          <div
            className="flex h-full w-[85%] cursor-pointer items-center justify-center overflow-hidden"
            onClick={handleProgressClick}
          >
            <div className="progress-bar-background w-full h-1 rounded-full bg-gray-600">
              <div
                className="progress-bar-foreground h-full rounded-full bg-green-500"
                style={{ width: `${progressBarWidth}%` }}
              ></div>
            </div>
          </div>
          <p className="h-full w-[50px] text-center text-[12px] text-white">
            {nowPlaying.track?.duration ? secondsToHMS(Number(nowPlaying.track?.duration)) : "--:--"}
          </p>
        </div>
      </div>
    </div>
  );
}
