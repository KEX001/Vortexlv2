import { Link, useNavigate } from "react-router-dom";
import reactlogo from "../../assets/icons8-react.png";
import tailwindlogo from "../../assets/icons8-tailwindcss.png";
bg480 from "../../assets/landing/landing-480px.webp";
import bg640 from "../../assets/landing/landing-640px.webp";
import bg768 from "../../assets/landing/landing-768px.webp";
import bg1024 from "../../assets/landing/landing-1024px.webp";
import bg1280 from "../../assets/landing/landing-1280px.webp";
import bg1536 from "../../assets/landing/landing-1536px.webp";
import { useEffect, useState } from "react";

export default function Intro() {
  const navigate = useNavigate();
  const [bgImg, setBgImg] = useState<string>("");

  function imageResize() {
    switch (true) {
      case innerWidth <= 480:
        setBgImg(bg480);
        break;
      case innerWidth <= 640:
        setBgImg(bg640);
        break;
      case innerWidth <= 768:
        setBgImg(bg768);
        break;
      case innerWidth <= 1024:
        setBgImg(bg1024);
        break;
      case innerWidth <= 1280:
        setBgImg(bg1280);
        break;
      case innerWidth <= 2500:
        setBgImg(bg1536);
        break;
      default:
        setBgImg(bg1024);
        break;
    }
  }

  useEffect(() => {
    imageResize();
    window.addEventListener("load", imageResize);
    window.addEventListener("resize", imageResize);
    return () => {
      window.removeEventListener("load", imageResize);
      window.removeEventListener("resize", imageResize);
    };
  }, []);

  function toHome() {
    navigate("/home");
  }

  return (
    <>
      <div
        style={{
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${bgImg})`,
        }}
        className="flex h-full w-full items-center shadow-inner shadow-black"
      >
        <div className="relative mx-auto flex h-auto w-[calc(100%-10%)] flex-col items-center rounded-lg bg-neutral-900 pt-4 font-mono sm:w-[550px] shadow-lg shadow-purple-500/40">
          {/* Header Section */}
          <div className="flex flex-col h-20 w-full items-start justify-between pl-6">
            <h2 className="text-4xl font-extrabold text-purple-500 tracking-wider xl:text-5xl animate-pulse">
              LowKey Music
            </h2>
            <h2 className="mt-2 border-b-2 border-purple-600 text-xl font-bold text-white md:text-2xl">
              Features
            </h2>
          </div>

          {/* Features List */}
          <ul className="mt-4 mb-2 w-full list-disc border-neutral-900 px-10 text-left text-sm font-medium">
            <li className="my-2 text-white hover:text-purple-300 transition-all duration-200">
              Tracks from diverse artists/albums/playlists
            </li>
            <li className="my-2 text-white hover:text-purple-300 transition-all duration-200">
              Multi search artists/albums/playlists
            </li>
            <li className="my-2 text-white hover:text-purple-300 transition-all duration-200">
              Add favorites and playlist creation
            </li>
            <li className="my-2 text-white hover:text-purple-300 transition-all duration-200">
              Recent listening history support
            </li>
            <li className="my-2 text-white hover:text-purple-300 transition-all duration-200">
              Activity support
            </li>
          </ul>

          {/* Technologies Used */}
          <div className="w-full px-6">
            <h2 className="mb-4 w-min whitespace-nowrap border-b-2 border-purple-600 text-lg font-bold text-white md:text-xl">
              Technologies used
            </h2>
            <ul className="flex flex-wrap gap-4">
              <li className="flex items-center text-sm font-bold text-white hover:text-teal-400 transition-colors">
                <p className="pr-1">React</p>
                <img src={reactlogo} className="h-5 w-5" alt="React logo" />
              </li>
              <li className="flex items-center text-sm font-bold text-white hover:text-teal-400 transition-colors">
                <p className="pr-1">TailwindCSS</p>
                <img src={tailwindlogo} className="h-5 w-5" alt="TailwindCSS logo" />
              </li>
              <li className="flex items-center text-sm font-bold text-white hover:text-teal-400 transition-colors">
                <p className="pr-1">Vite</p>
                <img src="/vite.svg" className="h-5 w-5" alt="Vite logo" />
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex w-full justify-evenly">
            <Link
              to="/home"
              onClick={toHome}
              className="transition-bg h-auto w-auto rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 p-3 px-6 text-sm font-extrabold text-black shadow-lg shadow-teal-300 hover:scale-105 hover:from-teal-500 hover:to-purple-500"
            >
              Check it out
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-6 w-full border-t border-neutral-800">
            <p className="py-4 text-center text-sm font-medium text-neutral-400">
              Made with <span className="text-red-500">❤</span> by
              <a
                href="https://github.com/tejas-git64"
                className="font-bold text-teal-500 hover:text-purple-400 transition-colors"
              >
                Tej
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
