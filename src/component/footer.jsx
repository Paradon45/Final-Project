import React, { useState, useEffect } from "react";
import { FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // นำเข้า useLocation จาก react-router-dom

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation(); // ใช้ useLocation เพื่อจับการเปลี่ยนหน้า

  useEffect(() => {
    // รีเซ็ตสถานะ isVisible ทุกครั้งที่มีการเปลี่ยนเส้นทาง
    setIsVisible(false);

    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        if (rect.top <= screenHeight) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]); // ติดตามการเปลี่ยนแปลงของ location (การเปลี่ยนหน้า)

  return (
    <footer
      className={`font-kanit bg-gradient-to-r from-orange-600 to-orange-800 text-white py-6 px-8 transition-opacity duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">ท่องเที่ยวขอนแก่น</h3>
            <p className="text-sm">
              &copy; 2024 ท่องเที่ยวขอนแก่น. All rights reserved.
            </p>
          </div>

          {/* Contact Info + Social Media */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-sm">ติดต่อเรา:</p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:paradon.pe@rmuti.ac.th"
                className="text-yellow-400 hover:underline text-sm flex items-center gap-2"
              >
                <FaEnvelope /> paradon.pe@rmuti.ac.th
              </a>
              <a
                href="https://www.facebook.com/paradon.permpool/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/hai_try555/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
