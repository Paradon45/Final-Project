import React, { useState, useEffect } from "react";
import GoogleMap from "../../system/googlemap";
import Image1 from "../../photo/จุดชมวิวหินช้างสี_อุทยานแห่งชาติน้ำพอง_จ.ขอนแก่น_01.jpg";
import Image2 from "../../photo/caption.jpg"; // Replace with actual image path
import Image3 from "../../photo/kao01.jpg"; // Replace with actual image path

const ViewPointPageAdmin = () => {
  const images = [Image1, Image2, Image3]; // Array of images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Reset to the top of the page instantly
    window.scrollTo(0, 0);
  }, []);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white font-kanit min-h-screen p-16">
      {/* Header */}
      <header className="animate-fadeInDelay1 text-center mb-8 mt-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          จุดชมวิวหินช้างสี
        </h1>
        <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
      </header>

      {/* Content Section */}
      <div className="container mx-auto px-6 lg:px-5">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 bg-white shadow-lg rounded-lg overflow-hidden p-6">
          {/* Image Section */}
          <div className="animate-fadeIn2Delay2 flex-1 mb-6 md:mb-0 relative">
            <img
              src={images[currentImageIndex]}
              alt={`วิวจุดชมวิวหินช้างสี ${currentImageIndex + 1}`}
              className="rounded-lg shadow-md w-full object-cover h-96"
            />
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full hover:bg-gray-300 hover:opacity-80 "
            >
              {"<"}
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full hover:bg-gray-300 hover:opacity-80 "
            >
              {">"}
            </button>
          </div>

          {/* Info Section */}
          <div className="animate-fadeInDelay2 flex-1 text-gray-700 ">
            <p className="font-semibold text-xl mb-4 text-yellow-600">
              จุดชมวิวหินช้างสี
            </p>
            <p className="text-base leading-7 mb-4">
              ตั้งอยู่ห่างจากตัวเมืองขอนแก่นประมาณ 60 กม. ในพื้นที่การดูแลของ
              <span className="font-semibold">อุทยานแห่งชาติน้ำพอง</span>
              ห่างจากที่ทำการอุทยานฯ 25 กิโลเมตร เส้นทางเป็นถนนลาดยางสะดวกสบาย
              เมื่อถึงจุดชมวิวจะพบกับวิวที่สวยงาม
              โดยมีระยะทางเดินศึกษาธรรมชาติประมาณ 400 เมตร
            </p>

            {/* Rating Section */}
            <div className="flex items-center mb-6">
              <span className="text-yellow-500 text-2xl">★★★★★</span>
              <span className="text-gray-600 ml-3">(5.0 คะแนนยอดเยี่ยม)</span>
            </div>

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden shadow-md mb-4">
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPointPageAdmin;
