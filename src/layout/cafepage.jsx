import React, { useEffect } from "react";
import image1 from "../photo/140b324156cf4c7480b0cf07bd1d0941.png";
import image2 from "../photo/44d545dffba34bf48a2eb26c826670ae.png";
import image3 from "../photo/images.png";
import { FaCoffee } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Cafepage = () => {

  const { t } = useTranslation();

  useEffect(() => {
    // Reset to the top of the page instantly
    window.scrollTo(0, 0);
  }, []);

  const cafes = [
    {
      image: image1,
      alt: "Double you Cafe",
      title: "Double you Cafe",
      type: "คาเฟ่",
      rating: "★★★★★",
      description: "บรรยากาศร้านสงบ ร่มรื่น ดีต่อใจอะ",
    },
    {
      image: image2,
      alt: "Dofarm Cafe",
      title: "Dofarm Cafe",
      type: "ร้านอาหาร",
      rating: "★★★★☆",
      description: "บรรยากาศท้องถิ่นใกล้ชิดธรรมชาติ",
    },
    {
      image: image3,
      alt: "Pi Coffee",
      title: "Pi Coffee",
      type: "คาเฟ่ & ร้านอาหาร",
      rating: "★★★★★",
      description: "กาแฟหอมละมุน สไตล์โมเดิร์นอบอุ่น",
    },
  ];

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-white animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
          {t("cafepage")}
          <FaCoffee className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
      </div>

      {/* Cafe Cards Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {cafes.map((cafe, index) => (
          <div
            key={index}
            className={`relative bg-white border rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl opacity-0 translate-y-10 delay-${
              index * 200
            } animate-fadeIn`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Image Section */}
            <div className="relative group">
              <img
                src={cafe.image}
                alt={cafe.alt}
                className="w-full h-48 object-cover"
              />
              <Link to="/cafes" className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-medium">
                ดูเพิ่มเติม
              </Link>
            </div>

            {/* Info Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {cafe.type}
                </span>
                <GiForkKnifeSpoon className="text-gray-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-2">
                {cafe.title}
              </h3>
              <span className="text-yellow-500 text-2xl">{cafe.rating}</span>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {cafe.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cafepage;
