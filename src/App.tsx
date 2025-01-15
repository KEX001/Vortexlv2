import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Layout from "./pages/Layout/Layout";
const Intro = lazy(() => import("./pages/Intro/Intro"));
const Home = lazy(() => import("./pages/Home/Home"));
const Search = lazy(() => import("./pages/Search/Search"));
const AlbumPage = lazy(() => import("./pages/Album/AlbumPage"));
const PlaylistPage = lazy(() => import("./pages/Playlist/PlaylistPage"));
const Library = lazy(() => import("./pages/Library/Library"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const ArtistPage = lazy(() => import("./pages/Artist/ArtistPage"));
const UserPlaylistPage = lazy(
  () => import("./pages/UserPlaylist/UserPlaylist"),
);
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

export default function App() {
  const queryClient = new QueryClient();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Intro />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="albums/:id" element={<AlbumPage />} />
        <Route path="playlists/:id" element={<PlaylistPage />} />
        <Route path="userplaylists/:id" element={<UserPlaylistPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
      </Route>,
    ),
  );

  {/*const emoticons = [
    "(👉ﾟヮﾟ)👉",
    "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    "ヾ(⌐■_■)ノ♪",
    "○( ＾皿＾)っ Hehehe…",
  ];

  function getRandomEmoticons() {
    return emoticons[Math.floor(Math.random() * emoticons.length)];
  }*/}

  const MainFallback = () => {
    const [loadingText, setLoadingText] = useState("Loading your vibes, please wait...");
    const [showSpinner, setShowSpinner] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
      // Initially, show only text for a few seconds, then show the spinner
      const timeout1 = setTimeout(() => {
        setShowText(true); // Show text after 2 seconds
      }, 2000); // 2 seconds

      const timeout2 = setTimeout(() => {
        setShowSpinner(true); // Show the spinner after 3 seconds
        setLoadingText("Your vibes are almost here!"); // Change text after 8 seconds
      }, 8000); // 8 seconds

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }, []);

    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-800">
        {showText && (
          <p className="text-xl font-semibold text-emerald-500">
            {loadingText}
          </p>
        )}
        {showSpinner && (
          <div className="loader-4">
            <div className="box1"></div>
            <div className="box2"></div>
            <div className="box3"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<MainFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
