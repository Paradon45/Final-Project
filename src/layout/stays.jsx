import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const CafeDetail = () => {
  const [location, setLocation] = useState(null);
  const { t } = useTranslation();
  const { locationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/location/${locationId}`, // Use locationId in API endpoint
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location details.");
        }

        const data = await response.json();
        setLocation(data.location);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocationDetails();
    window.scrollTo(0, 0); // Reset to top of page
  }, [locationId]); // Add locationId as a dependency

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { name, description, locationImg, address, phone, date, map } = location;

  return (
    <div className="bg-gray-100 font-kanit min-h-screen">
      <header
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            locationImg[0]?.url || "https://via.placeholder.com/300"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="animate-fadeIn2Delay1 text-5xl font-bold text-white">
            {name}
          </h1>
        </div>
      </header>

      <section className="animate-fadeInDelay1 max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-600 mt-3">{description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-orange-500 text-3xl mr-4" />
              <div>
                <p className="font-bold text-base">{t("location")}</p>
                <p className="text-sm">{address}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaPhoneAlt className="text-orange-500 text-2xl mr-4" />
              <div>
                <p className="font-bold text-base">{t("phone")}</p>
                <p className="text-sm">{phone}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FaClock className="text-orange-500 text-2xl mr-4" />
              <div>
                <p className="font-bold text-base">{t("open-close")}</p>
                <p className="text-sm">{date}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-6">
            <FaStar className="text-yellow-500 text-2xl" />
            <p className="ml-2 text-xl font-bold text-gray-800">4.9</p>
            <span className="text-gray-500 text-lg ml-2">/ 5.0</span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {t("more_images")}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {locationImg.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-md transform hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => setSelectedImage(image.url)}
            />
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="animate-fadeIn2 fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative animate-scaleUp">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-96 rounded-lg"
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

      <div className="bg-gray-100 py-10 flex justify-center">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-5xl border border-gray-200">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-left mb-6">
            {t("map")}
          </h2>

          {/* Google Map Container */}
          <div className="flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-md border border-gray-300 bg-white w-full max-w-3xl">
              <div className="relative" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={map}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
