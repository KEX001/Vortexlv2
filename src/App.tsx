import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
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

  const MainFallback = () => {
    useEffect(() => {
      // Keep the page loading for 1 to 2 minutes (between 60 and 120 seconds)
      const minTime = 60000; // 1 minute
      const maxTime = 120000; // 2 minutes
      const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

      const timeout = setTimeout(() => {
        // Any action after the compulsory waiting time (if needed)
      }, randomTime);

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <div className="flex items-center justify-center h-full w-full bg-black">
        <div className="bg-black p-8 rounded-lg flex flex-col items-center">
          <img
            src="https://github.com/KEX001/Vortexlv2/blob/master/public/Ripple%401x-1.3s-200px-200px.gif?raw=true"
            alt="Loading"
            className="h-32 w-32"
          />
        </div>
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
