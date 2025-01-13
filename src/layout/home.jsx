import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import myImage from "../photo/20180328812f8494092d52cc3373d93baeb9e966115448.jpg";

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Scroll to top when the component is mounted
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="font-kanit relative text-white">
      <header
        className="animate-fadeInDelay1 relative h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${myImage})`,
        }}
      >
        <div className="animate-fadeInDelay2 absolute top-0 left-0 w-full h-full flex flex-col items-start justify-start p-12">
          <h1
            className="text-8xl font-bold mb-4 mt-5 "
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            Discover Khon Kaen
          </h1>
          <p className="text-xl mb-6 font-bold">{t("headers")}</p>
          <p className="text-lg mb-6 max-w-md">{t("des")}</p>
          <div className="flex w-full max-w-md mt-4">
            <input
              type="text"
              placeholder={t("ph_seach")}
              className="flex-1 px-4 py-2 rounded-l-md border-none outline-none text-black"
            />
            <button className="px-4 py-2 bg-white hover:bg-gray-200 rounded-r-md text-gray-400">
              {t("seach")}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
