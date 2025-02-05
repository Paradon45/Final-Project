import React from "react";
import { useNavigate } from "react-router-dom";
import Image from "../photo/pexels-kaip-1341279.jpg";
import Image2 from "../photo/imageword.png";

const Word = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token) {
      if (role === "ADMIN") {
        navigate("/homeadmin"); 
      } else {
        navigate("/home"); 
      }
    } else {
      navigate("/home"); 
    }
  };

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${Image})`,
      }}
      onClick={handleClick} // กดที่ไหนก็ไปต่อ
    >
      <div className="relative cursor-pointer">
        {/* ลูกโลก (ขนาดใหญ่และมีเงาดำ) */}
        <div
          className="w-[500px] h-[500px] rounded-full bg-center bg-cover animate-spin-slow shadow-xl"
          style={{
            backgroundImage: `url(${Image2})`,
          }}
        ></div>
        {/* ข้อความ (เพิ่มเงา) */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold text-center max-w-[500px] whitespace-nowrap"
          style={{
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)", // เพิ่มเงาให้กับข้อความ
          }}
        >
          Discover Khon Kaen
        </div>
      </div>
      {/* คำใบ้ด้านล่าง */}
      <div className="animate-fadeInDelay1 absolute bottom-5 text-center w-full text-sm text-gray-400">
        " Click anywhere to continue "
      </div>
    </div>
  );
};

export default Word;
