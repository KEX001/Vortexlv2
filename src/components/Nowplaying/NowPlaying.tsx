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
  let songIndex = nowPlaying.queue.songs?.findIndex(
    (song: TrackDetails) => song.id === nowPlaying.track?.id,
  );
  const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");
  const playlist = library.userPlaylists.find((obj) => {
    return obj.songs.find((song) => {
      return song.id === nowPlaying.track?.id;
    });
  });
  function removeFromPlaylist(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    playlistid: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    nowPlaying.track &&
      removeFromUserPlaylist(playlistid, nowPlaying.track?.id);
  }
  function handlePlay(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.play();
    setIsPlaying(true);
  }
  function handlePause(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    wavesurfer.current?.pause();
    setIsPlaying(false);
  }
  function revealTrackMenu(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    nowPlaying.track && setCreationTrack(nowPlaying.track);
    setRevealCreation(true);
  }

  function playOrder() {
    if (isShuffling === false) {
      console.log(songIndex);
      songIndex && setNowPlaying(nowPlaying.queue.songs[songIndex]);
    } else {
      const randomIndex = Math.floor(
        Math.random() * nowPlaying.queue.songs.length,
      );
      setNowPlaying(nowPlaying.queue.songs[randomIndex]);
    }
  }

  function handlePrevious(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setNowPlaying(null);
    if (songIndex === 0) {
      setNowPlaying(nowPlaying.queue.songs[nowPlaying.queue.songs.length - 1]);
    } else {
      setNowPlaying(nowPlaying.queue.songs[songIndex - 1]);
    }
  }

  function handleNext(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    setNowPlaying(null);
    songIndex === nowPlaying.queue.songs.length - 1
      ? setNowPlaying(nowPlaying.queue.songs[0])
      : setNowPlaying(nowPlaying.queue.songs[songIndex + 1]);
  }

  useEffect(() => {
    switch (true) {
      case wavesurfer.current?.isPlaying() === false &&
        nowPlaying.isPlaying === true:
        wavesurfer.current.play();
        break;
      case wavesurfer.current?.isPlaying() === true &&
        nowPlaying.isPlaying === false:
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
        progressColor: "#10B981",
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
      wavesurfer.current && setCurrentTime(wavesurfer.current.getCurrentTime());
    });
    wavesurfer.current?.on("timeupdate", () => {
      wavesurfer.current && setCurrentTime(wavesurfer.current.getCurrentTime());
    });
    wavesurfer.current?.on("finish", () => {
      songIndex++;
      setIsPlaying(false);
      if (songIndex === -1) {
        setShowPlayer(false);
      } else {
        playOrder();
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
          src={
            nowPlaying.track && nowPlaying.track.id !== ""
              ? nowPlaying.track?.image[2]?.url
              : songfallback
          }
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
            {nowPlaying.track?.artists.all.map(
              (artist: ArtistInSong) => artist.name,
            )}
          </p>
        </div>
      </div>
      <div className="flex h-full w-auto flex-col items-center justify-evenly p-1.5 sm:w-[40%]">
        {/* Controls */}
        <div className="flex w-[250px] items-center justify-around pt-0.5">
          {isShuffling ? (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
              onClick={(e) => {
                e.stopPropagation();
                setIsShuffling(false);
              }}
              disabled={nowPlaying.queue.songs.length === 0}
            >
              <img
                src={random}
                alt="random"
                className="h-[20px] w-[20px] bg-transparent"
              />
            </button>
          ) : (
            <button
              type="button"
              style={{
                border: "none",
                outline: "none",
              }}
              className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
              onClick={(e) => {
                e.stopPropagation();
                setIsShuffling(true);
              }}
              disabled={nowPlaying.queue.songs.length === 0}
            >
              <img
                src={shuffle}
                alt="shuffle"
                className="h-[20px] w-[20px] bg-transparent"
              />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handlePrevious(e)}
            style={{
              border: "none",
              outline: "none",
            }}
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
            disabled={nowPlaying.queue.songs.length === 0}
          >
            <img
              src={previous}
              alt="previous"
              className="h-[28px] w-[28px] bg-transparent"
            />
          </button>
          {nowPlaying.isPlaying === true ? (
            <button
              type="button"
              onClick={(e) => handlePause(e)}
              style={{
                border: "none",
                outline: "none",
              }}
              className={`h-auto w-auto rounded-full border-none bg-neutral-100 p-1 outline-none disabled:cursor-not-allowed disabled:bg-neutral-600`}
              disabled={!nowPlaying.track?.id}
            >
              <img
                src={pause}
                alt="pause"
                className={`h-[25px] w-[25px] ${
                  nowPlaying.isPlaying ? "pl-0" : "pl-0.5"
                }`}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => handlePlay(e)}
              style={{
                border: "none",
                outline: "none",
              }}
              className={`h-auto w-auto rounded-full border-none bg-neutral-100 p-1 outline-none disabled:cursor-not-allowed disabled:bg-neutral-600`}
              disabled={!nowPlaying.track?.id}
            >
              <img
                src={play}
                alt="play"
                className={`h-[25px] w-[25px] ${
                  nowPlaying.isPlaying ? "pl-0" : "pl-0.5"
                }`}
              />
            </button>
          )}
          <button
            type="button"
            className="border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed disabled:invert-[0.5]"
            onClick={(e) => handleNext(e)}
            disabled={nowPlaying.queue.songs.length === 0}
          >
            <img
              src={next}
              alt="next"
              className="h-[28px] w-[28px] bg-transparent"
            />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-1 flex h-5 w-[350px] items-center justify-between lg:w-[500px] xl:w-[700px]">
          <p className="h-full w-[50px] text-center text-[12px] text-white">
            {currentTime ? formatTime(currentTime) : "0:00"}
          </p>
          {/* Custom Progress Bar */}
          <div className="mx-auto mb-0.5 flex h-auto w-[85%] items-center justify-center overflow-hidden">
            <input
              type="range"
              id="progress-bar"
              min={0}
              max={nowPlaying.track?.duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => wavesurfer.current?.seekTo(Number(e.target.value) / nowPlaying.track?.duration)}
              disabled={nowPlaying.track?.id === ""}
            />
          </div>
          <p className="h-full w-[50px] text-center text-[12px] text-white">
            {nowPlaying.track?.duration
              ? secondsToHMS(Number(nowPlaying.track?.duration))
              : "--:--"}
          </p>
        </div>
      </div>
      <div className="flex h-full w-[30%] items-center justify-end pr-2.5">
        <div className="flex flex-col justify-center p-2">
          {/* Volume Control */}
          <div className="relative flex justify-center">
            <div className="absolute right-0 top-[10px]">
              {nowPlaying.isMuted ? (
                <button
                  onClick={() => {
                    wavesurfer.current?.setVolume(1);
                    wavesurfer.current?.toggleMute();
                  }}
                  className="h-[24px] w-[24px]"
                >
                  <img
                    src={mute}
                    alt="volume"
                    className="h-[20px] w-[20px] bg-transparent"
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    wavesurfer.current?.setVolume(0);
                    wavesurfer.current?.toggleMute();
                  }}
                  className="h-[24px] w-[24px]"
                >
                  <img
                    src={vol}
                    alt="volume"
                    className="h-[20px] w-[20px] bg-transparent"
                  />
                </button>
              )}
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={wavesurfer.current?.getVolume() || 1}
              onChange={(e) =>
                wavesurfer.current?.setVolume(parseFloat(e.target.value))
              }
              className="h-[4px] w-[120px] bg-neutral-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
