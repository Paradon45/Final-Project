import React, { useEffect } from "react";
import image1 from "../photo/avani-khon-kaen-hotel.jpg";
import image2 from "../photo/96483612.jpg";
import image3 from "../photo/Inpawa-Hotel-Ban-Phai-Exterior.jpg";
import { FaHotel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Staypage = () => {

    const { t } = useTranslation();
  
  useEffect(() => {
    // Reset to the top of the page instantly
    window.scrollTo(0, 0);
  }, []);

  const stays = [
    {
      image: image1,
      alt: "AVANI Khon Kaen Hotel & Convention Centre",
      title: "AVANI Khon Kaen Hotel & Convention Centre",
      rating: "★★★★★",   
      description: "ที่นี่คือที่พักขอนแก่นที่เหมาะกับการพักผ่อนในขอนแก่นสุด ๆ เพราะจะได้ทำให้คุณได้สัมผัสกับความสบาย",
    },
    {
      image: image2,
      alt: "Anchan Laguna Hotel Khonkaen",
      title: "Anchan Laguna Hotel Khonkaen",
      rating: "★★★★☆",
      description: "เป็นโรงแรมขอนแก่นที่สร้างความอบอุ่นให้ผู้เข้าพัก ได้รู้สึกเหมือนได้อยู่บ้าน โดยจ่ายในราคาประหยัด",
    },
    {
      image: image3,
      alt: "อินภาวา บูติค โฮเต็ล (Inpawa Hotel)",
      title: "อินภาวา บูติค โฮเต็ล (Inpawa Hotel)",
      rating: "★★★★★",
      description: "สัมผัสความเขียวขจีและความร่มรื่นได้ภายในโรงแรมขอนแก่นชื่อดังอีกหนึ่งที่ อย่าง อินภาวา บูติค โฮเต็ล ",
    },
  ];

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-white animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
          {t("staypage")}
          <FaHotel className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
      </div>

      {/* Stay Cards Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {stays.map((stay, index) => (
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
                src={stay.image}
                alt={stay.alt}
                className="w-full h-48 object-cover"
              />
              <Link to="/stays" className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-medium">
                ดูเพิ่มเติม
              </Link>
            </div>

            {/* Info Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mt-2 ">
                {stay.title}
              </h3>
              <span className="text-yellow-500 text-2xl">{stay.rating}</span>
              <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {stay.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staypage;
