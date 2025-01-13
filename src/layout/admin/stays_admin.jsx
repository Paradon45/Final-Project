import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import image1 from "../../photo/hotel-building.jpg";
import image2 from "../../photo/avani-khon-kaen-hotel.jpg";
import image3 from "../../photo/539799461.jpg";

const StayDetailAdmin = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Reset to the top of the page instantly
    window.scrollTo(0, 0);
  }, []);

  const stay = {
    name: "AVANI Khon Kaen Hotel",
    description:
      "ด้วยพื้นที่ใช้สอยกว่า 4,000 ตร.ม. อวานี ขอนแก่น จึงเหมาะเป็นที่พักสำหรับวัตถุประสงค์ทั้งการทำงานและการพักผ่อนหย่อนใจ ให้คุณได้ประชุม จัดแสดงงาน สัมมนา แล้วไปต่อที่บาร์คาราโอเกะ ผับ และสถานที่ท่องเที่ยวในเมือง เรามีทุกสิ่งอำนวยความสะดวกครบครันที่จะช่วยสร้างสมดุลระหว่างการทำงานและการพักผ่อน ทั้งสระว่ายน้ำเย็น ห้องออกกำลังกาย และสปา 'ahh' รวมไปถึงทำเลที่ดีที่สุดแห่งหนึ่งในเมือง",
    address: "หมู่ที่ 4 999 ถนน ประชาสโมสร อำเภอเมืองขอนแก่น ขอนแก่น 40000",
    hours: "เปิดตลอดเวลา",
    phone: "043 209 888",
    rating: 4.5,
    gallery: [image1, image2, image3],
  };

  return (
    <div className="bg-gray-100 font-kanit min-h-screen">
      {/* Header */}
      <header
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${stay.gallery[0]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="animate-fadeIn2Delay1 text-5xl font-bold text-white">
            {stay.name}
          </h1>
        </div>
      </header>

      {/* Details Section */}
      <section className="animate-fadeInDelay1 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800">{stay.name}</h2>
          <p className="text-gray-600 mt-3">{stay.description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-orange-500 text-3xl mr-4" />
              <div>
                <p className="font-bold text-base">ที่อยู่</p>
                <p className="text-sm">{stay.address}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaPhoneAlt className="text-orange-500 text-2xl mr-4" />
              <div>
                <p className="font-bold text-base">เบอร์โทร</p>
                <p className="text-sm">{stay.phone}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaClock className="text-orange-500 text-2xl mr-4" />
              <div>
                <p className="font-bold text-base">เวลาเปิด-ปิด</p>
                <p className="text-sm">{stay.hours}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-6">
            <FaStar className="text-yellow-500 text-2xl" />
            <p className="ml-2 text-xl font-bold text-gray-800">
              {stay.rating}
            </p>
            <span className="text-gray-500 text-lg ml-2">/ 5.0</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">ภาพเพิ่มเติม</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {stay.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-md transform hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative animate-scaleUp">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-screen rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-xl bg-gray-500 opacity-70 p-2 rounded-full hover:bg-gray-600"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StayDetailAdmin;
