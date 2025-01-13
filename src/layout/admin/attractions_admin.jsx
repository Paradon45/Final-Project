import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import templeImage from "../../photo/location-2.jpg";
import waterfallImage from "../../photo/4adc14b0-f135-11eb-be32-97b1a38a3d1b_webp_original.jpg";

const AttractionAdmin = () => {
  const { t } = useTranslation();

  const attractions = [
    {
      name: "➤ จุดชมวิวหินช้างสี",
    },
    {
      name: "➤ เขื่อนอุบลรัตน์",
    },
    {
      name: "➤ อุทยานแห่งชาติภูเวียง",
    },
    {
      name: "➤ น้ำตกตาดฟ้า",
    },
    {
      name: "➤ เพิ่มเติม",
    },
  ];

  useEffect(() => {
    // Reset to the top of the page instantly
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-kanit">
      {/* ส่วน Header */}
      <header
        className="relative h-[400px] w-full bg-cover bg-center "
        style={{ backgroundImage: `url(${templeImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center p-12 text-white">
          <h1
            className="animate-fadeIn3 text-6xl font-bold mb-4"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {t("attractions")}
          </h1>
          <p
            className="animate-fadeIn3Delay1 text-lg"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {t("khonkaen")}
          </p>
        </div>
      </header>

      {/* ส่วนเนื้อหา */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={waterfallImage}
              alt="Waterfall"
              className="w-full h-80 object-cover md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0"
            />
            <div className="md:ml-8">
              <h2
                className="animate-fadeIn3 text-5xl text-red-600 font-bold mb-4 relative "
                style={{ top: "-55px" }}
              >
                {t("nature")}
              </h2>
              <div
                className="w-50 h-1 bg-gray-200 mt-4 relative "
                style={{ top: "-55px" }}
              ></div>
              <div>
                {attractions.map((attractions, index) => (
                  <ul
                    key={index}
                    className={`text-gray-700 text-base space-y-2 relative transform transition-all opacity-0  delay-${
                      index * 200
                    } animate-fadeIn3Delay1`}
                    style={{ top: "-40px", animationDelay: `${index * 0.2}s` }}
                  >
                    <Link
                      to="/viewpointadmin"
                      className="block hover:text-yellow-500 transition duration-300 mt-2"
                    >
                      {attractions.name}
                    </Link>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AttractionAdmin;
