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
      // Keep the page loading for 3 minutes (180 seconds)
      const timeout = setTimeout(() => {
        // Any action after 3 minutes (if needed)
      }, 180000); // 3 minutes

      return () => {
        clearTimeout(timeout);
      };
    }, []);

    return (
      <div className="flex items-center justify-center h-full w-full bg-neutral-800">
        <img
          src="https://github.com/KEX001/Vortexlv2/blob/master/src/assets/icons8-loading.gif?raw=true"
          alt="Loading"
          className="h-32 w-32"
        />
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
