import { Link, useNavigate } from "react-router-dom";
import reactlogo from "../../assets/icons8-react.png";
import tailwindlogo from "../../assets/icons8-tailwindcss.png";
import bg480 from "../../assets/landing/landing-480px.webp";
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
        <div className="relative mx-auto flex h-auto w-[calc(100%-10%)] flex-col items-center rounded-lg bg-neutral-900 pt-6 pb-4 font-mono sm:w-[550px] shadow-md">
          {/* Header Section */}
          <div className="flex flex-col h-20 w-full items-start justify-between pl-6">
            <h2 className="text-3xl font-semibold text-purple-500 tracking-wide xl:text-4xl">
              Vᴏʀᴛᴇx ⍱
            </h2>
            <h2 className="mt-2 border-b-2 border-purple-600 text-lg font-bold text-white md:text-xl">
              Attributes
            </h2>
          </div>

          {/* Features List */}
          <ul className="mt-4 mb-2 w-full list-disc border-neutral-900 px-10 text-left text-sm font-medium">
            <li className="my-2 text-white">A variety of songs from artists, albums, and playlists</li>
            <li className="my-2 text-white">Search across multiple artists, albums, and playlists</li>
            <li className="my-2 text-white">Save songs as favorites and craft unique playlists</li>
            <li className="my-2 text-white">Keep record of recent music played</li>
            <li className="my-2 text-white">Activity history support</li>
          </ul>

          {/* Social Links */}
          <div className="flex justify-center gap-4 text-muted-foreground md:mt-4">
            <a
              aria-label="Telegram"
              href="https://t.me/STORM_TECHH"
              target="_blank"
              rel="noopener noreferrer"
              className="duration-200 hover:text-foreground"
            >
              <Icons.Telegram className="size-4" />
            </a>
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/kxunal._/"
              target="_blank"
              rel="noopener noreferrer"
              className="duration-200 hover:text-foreground"
            >
              <Icons.Instagram className="size-4" />
            </a>
            <a
              aria-label="Twitter"
              href="https://twitter.com/kxunall"
              target="_blank"
              rel="noopener noreferrer"
              className="duration-200 hover:text-foreground"
            >
              <Icons.Twitter className="size-4" />
            </a>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex w-full justify-center">
            <Link
              to="/home"
              onClick={toHome}
              className="transition-transform rounded-lg bg-purple-600 px-6 py-2 text-sm font-bold text-white hover:scale-105 hover:bg-purple-500"
            >
              Next
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-6 w-full border-t border-neutral-800">
            <p className="py-3 text-center text-sm font-medium text-neutral-400">
              Developers
            </p>
            <p className="py-3 text-center text-sm font-medium text-neutral-400">
              <a
                href="https://t.me/ll_KEX_ll"
                className="font-bold text-teal-500 hover:text-teal-400"
              >
                Kunal
              </a>{" "}
              &amp;{" "}
              <a
                href="https://t.me/interstellarXd"
                className="font-bold text-teal-500 hover:text-teal-400"
              >
                Prakhar
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
