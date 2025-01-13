import React, { useEffect, useState } from "react";
import GoogleMap from "../system/googlemap"; // ใช้คอมโพเนนต์ Google Map ที่คุณมีอยู่
import { FaUser, FaEnvelope, FaCommentDots} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const ContactUsPage = () => {

    useEffect(() => {
        // Reset to the top of the page instantly
        window.scrollTo(0, 0);
      }, []);

    const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "กรุณากรอกชื่อ";
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง";
    }
    if (!formData.message.trim()) newErrors.message = "กรุณากรอกข้อความ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data Submitted:", formData);
      setSuccessMessage("ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white font-kanit min-h-screen p-16">
      {/* Header */}
      <header className="animate-fadeIn text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex justify-center items-center">{t("contact")}
            <FaUser className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h1>
        <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
      </header>

      {/* Content Section */}
      <div className="animate-fadeInDelay1 container mx-auto px-6 lg:px-5">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 bg-white shadow-lg rounded-lg overflow-hidden p-6">
          {/* Form Section */}
          <div className="flex-1 mb-6 md:mb-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex text-gray-700 font-semibold mb-2 items-center">
                  ชื่อ
                  <FaUser className="ml-2 mb-1"/>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="flex text-gray-700 font-semibold mb-2 items-center">
                  อีเมล
                  <FaEnvelope className="ml-3"/>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="flex text-gray-700 font-semibold mb-2 items-center">
                  ข้อความ
                  <FaCommentDots className="ml-3"/>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                ส่งข้อความ
              </button>
            </form>
            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
          </div>

          {/* Map Section */}
          <div className="flex-1">
            <h2 className="flex text-xl font-semibold text-gray-800 mb-4">
              ที่ตั้งของเรา
              <FaLocationDot className="ml-2 mt-1"/>
            </h2>
            <div className="rounded-lg overflow-hidden shadow-md">
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
