import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useTranslation } from "react-i18next";
import Comments from "../component/comment";


const ViewPointPage = () => {
  const { locationId } = useParams(); // Get locationId from the URL
  const [location, setLocation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const userId = localStorage.getItem("userID");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/location/${locationId}`, // Use locationId in API endpoint
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

  const handleNextImage = () => {
    if (location?.locationImg?.length) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % location.locationImg.length
      );
    }
  };

  const handlePrevImage = () => {
    if (location?.locationImg?.length) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + location.locationImg.length) %
          location.locationImg.length
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { name, description, locationImg, map, locationScore } = location;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white font-kanit min-h-screen p-16">
      {/* Header */}
      <header className="animate-fadeInDelay1 text-center mb-8 mt-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">{name}</h1>
        <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        {/* ปุ่มกลับ */}
        <div className="text-left mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200"
          >
            {t("back")}
          </button>
          </div>
      </header>

      

      {/* Content Section */}
      <div className="container mx-auto px-6 lg:px-5">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 bg-white shadow-lg rounded-lg overflow-hidden p-6">
          {/* Image Section */}
          <div className="animate-fadeIn2Delay2 flex-1 mb-6 md:mb-0 relative">
            {locationImg && locationImg.length > 0 && (
              <img
                src={locationImg[currentImageIndex]?.url}
                alt={`วิว ${name} ${currentImageIndex + 1}`}
                className="rounded-lg shadow-md w-full object-cover h-96"
              />
            )}
            {/* Navigation Buttons */}
            {locationImg && locationImg.length > 1 && (
              <>
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
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="animate-fadeInDelay2 flex-1 text-gray-700 ">
            <p className="font-semibold text-xl mb-4 text-yellow-600">{name}</p>
            <p className="text-base leading-7 mb-4">{description}</p>

            {/* Rating Section */}
            <div className="flex items-center mb-6">
              <span className="text-yellow-500 text-2xl">{[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-yellow-500 ${
                i < locationScore[0]?.score ? "opacity-100" : "opacity-30"
              }`}
            >
              ★
            </span>
          ))}</span>
              <span className="text-gray-600 ml-3">({locationScore[0]?.score || 0}.0)</span>
            </div>

            {/* Google Map */}
            <div className="rounded-lg overflow-hidden shadow-md mb-4">
              <div
                style={{
                  overflow: "hidden",
                  position: "relative",
                  paddingTop: "56.25%",
                }}
              >
                <iframe
                  src= {map}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", top: 0, left: 0 }}
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
      <Comments locationId={locationId} userId={userId} token={token} />
    </div>
  );
};

export default ViewPointPage;
