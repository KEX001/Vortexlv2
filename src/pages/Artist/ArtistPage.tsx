import x from "../../assets/icons8-twitterx.svg";
import meta from "../../assets/icons8-meta.svg";
import wiki from "../../assets/icons8-wiki.svg";
import verified from "../../assets/icons8-verified.svg";
import loadingGif from "../../assets/loading.svg";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getArtistAlbums,
  getArtistDetails,
  getArtistSongs,
} from "../../api/requests";
import { useBoundStore } from "../../store/store";
import Song from "../../components/Song/Song";
import { TrackDetails } from "../../types/GlobalTypes";
import artistfallback from "../../assets/icons8-artist-fallback.png";
import { useQuery } from "@tanstack/react-query";
import ArtistPageLoading from "./Loading";
import RouteNav from "../../components/RouteNav/RouteNav";
import songfallback from "../../assets/icons8-song-fallback.png";

export default function ArtistPage() {
  const { id } = useParams();
  const {
    artist,
    setArtistAlbums,
    setArtistDetails,
    setArtistSongs,
    setFollowing,
    library,
    removeFollowing,
  } = useBoundStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { isPending: artistDetailsPending } = useQuery({
    queryKey: ["artistdetails"],
    queryFn: () => id && getArtistDetails(id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data: any) => setArtistDetails(data.data),
  });

  const { isPending: artistAlbumsPending } = useQuery({
    queryKey: ["artistalbums"],
    queryFn: () => id && getArtistAlbums(id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data: any) => setArtistAlbums(data.data.results),
  });

  const { isPending: artistSongsPending } = useQuery({
    queryKey: ["artistsongs"],
    queryFn: () => id && getArtistSongs(id),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data: any) => setArtistSongs(data.data.results),
  });

  function followArtist() {
    setIsLoading((prev) => !prev);
    setTimeout(() => setIsLoading((prev) => !prev), 500);
    setTimeout(() => setFollowing(artist.details), 500);
  }

  useEffect(() => {
    if (id) {
      getArtistDetails(id);
      getArtistAlbums(id);
      getArtistSongs(id);
    }
  }, [id]);

  const NewArtistPage = () => {
    return (
      <div className="h-auto max-h-fit w-full bg-neutral-900">
        <div className="relative flex h-auto w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600 via-neutral-800 to-black p-4 sm:flex-row sm:items-end sm:justify-between sm:bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]">
          <div className="absolute right-2 top-2 h-auto w-auto">
            <RouteNav />
          </div>
          <div className="flex h-full min-w-[80%] flex-col items-center justify-center text-center sm:h-full sm:w-[70%] sm:flex-row sm:justify-start sm:text-left">
            <img
              src={
                artist.details.image
                  ? artist.details.image[1]?.link
                  : artistfallback
              }
              alt="artist-img"
              className="h-[150px] w-[150px] sm:mr-4"
            />
            <div>
              <div className="flex h-fit w-full items-center justify-center sm:justify-start">
                <p className="my-2 ml-5 line-clamp-2 w-full overflow-hidden whitespace-pre-line text-center text-3xl font-bold capitalize text-white sm:my-0 sm:ml-0 sm:w-fit sm:text-left sm:text-4xl">
                  {artist.details.name ? artist.details.name : ""}
                </p>
                <img
                  src={verified}
                  alt="verified"
                  className="h-[24px] w-[24px]"
                />
              </div>
              <p className="text-md font-semibold leading-5 text-neutral-400">
                {artist.details.followerCount} Followers
              </p>
              <p className="text-sm font-semibold text-neutral-400">
                {artist.details.fanCount} Fans
              </p>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-between sm:h-[150px] sm:items-end">
            <ul className="my-2.5 flex h-full w-[45%] items-center justify-evenly sm:my-1.5 sm:w-fit sm:items-end sm:justify-end">
              {artist.details.fb && (
                <li className="mr-4">
                  <a href={artist.details.fb} target="_blank">
                    <img
                      src={meta}
                      alt="meta"
                      className="h-[28px] w-[28px] sm:h-[24px] sm:w-[24px]"
                    />
                  </a>
                </li>
              )}
              {artist.details.twitter && (
                <li>
                  <a href={artist.details.twitter} target="_blank">
                    <img
                      src={x}
                      alt="x"
                      className="mr-4 h-[28px] w-[28px] sm:h-[24px] sm:w-[24px]"
                    />
                  </a>
                </li>
              )}

              {artist.details.fb && (
                <li>
                  <a href={artist.details.wiki} target="_blank">
                    <img
                      src={wiki}
                      alt="wiki"
                      className="h-[30px] w-[30px] sm:h-[24px] sm:w-[24px]"
                    />
                  </a>
                </li>
              )}
            </ul>
            {library.followings.some(
              (following) => following.id === artist.details.id,
            ) ? (
              <div
                role="button"
                style={{
                  outline: "none",
                  border: "none",
                }}
                onClick={() => id && removeFollowing(id)}
                className={`ease pl-2" w-[100px] rounded-lg bg-green-400 p-1.5 text-center font-semibold text-black transition-all ease-in-out sm:mx-0 sm:mt-1.5
                `}
              >
                <img
                  src={isLoading ? loadingGif : ""}
                  alt="loading"
                  className={`${
                    isLoading ? "block" : "hidden"
                  } mx-auto h-[20px] w-[20px]`}
                />
                <p className={`${isLoading ? "hidden" : "block"} text-sm`}>
                  Following ✓
                </p>
              </div>
            ) : (
              <div
                role="button"
                style={{
                  outline: "none",
                  border: "none",
                }}
                onClick={followArtist}
                className={`ease } w-[100px] rounded-lg bg-white p-1.5 text-center font-semibold text-black transition-all ease-in-out sm:mx-0
                sm:mt-1.5`}
              >
                <img
                  src={isLoading ? loadingGif : ""}
                  alt="loading"
                  className={`${
                    isLoading ? "block" : "hidden"
                  } mx-auto h-[20px] w-[20px]`}
                />
                <p className={`${isLoading ? "hidden" : "block"} text-sm`}>
                  Follow{" "}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Artist Albums */}
        <div className="h-[240px] w-full px-4 py-3 pb-12">
          <h2 className="text-xl font-semibold text-white">Albums</h2>
          <ul className="mx-auto mt-2.5 flex h-full w-full items-center justify-start overflow-y-hidden overflow-x-scroll">
            {artist.albums.map((album) => (
              <li
                key={album.id}
                onClick={() =>
                  navigate(`/albums/${album.id}`, { replace: true })
                }
                className="mr-4 h-[180px] w-[150px] flex-shrink-0"
              >
                <img
                  src={album.image ? album.image[1]?.link : songfallback}
                  alt="artist-album"
                  className="h-[150px] w-[150px]"
                />
                <p className="mt-1 line-clamp-1 w-full text-ellipsis text-center text-xs text-neutral-400">
                  {album.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-auto max-h-fit w-full px-4 py-2 pb-4">
          <h2 className="pb-2 text-xl font-semibold text-white">Songs</h2>
          <ul
            id="artist-songs-list"
            className="max-h-auto mx-auto mt-1 h-auto w-full overflow-x-hidden overflow-y-scroll bg-neutral-900 pb-28 sm:pb-20"
          >
            {artist.songs.map((song: TrackDetails) => (
              <Song
                id={song.id}
                key={song.id}
                name={song.name}
                type={song.type}
                album={{
                  id: song.album.id,
                  name: song.album.name,
                  url: song.album.url,
                }}
                year={song.year}
                releaseDate={song.releaseDate}
                duration={song.duration}
                label={song.label}
                primaryArtists={song.primaryArtists}
                primaryArtistsId={song.featuredArtistsId}
                featuredArtists={song.featuredArtists}
                featuredArtistsId={song.featuredArtistsId}
                explicitContent={song.explicitContent}
                playCount={song.playCount}
                language={song.language}
                hasLyrics={song.hasLyrics}
                url={song.url}
                copyright={song.copyright}
                image={song.image}
                downloadUrl={song.downloadUrl}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const DataComponent = () => {
    if (!artistDetailsPending && !artistAlbumsPending && !artistSongsPending) {
      return <NewArtistPage />;
    } else {
      throw new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <Suspense fallback={<ArtistPageLoading />}>
      <DataComponent />
    </Suspense>
  );
}
