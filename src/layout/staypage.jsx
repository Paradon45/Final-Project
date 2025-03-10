import React, { useEffect, useState } from "react";
import { FaHotel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AddedPlacesModal from "../component/addedplaces";
import { FaMap, FaFilter } from "react-icons/fa";

const Cafepage = () => {
  const { t } = useTranslation();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterByPrice, setFilterByPrice] = useState(false); // สถานะการกรองตามราคา
  const [filterByRating, setFilterByRating] = useState(true); // สถานะการกรองตามคะแนน

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchstays = async () => {
      try {
        const response = await fetch(`${API_URL}/location/landing`);
        if (!response.ok) {
          throw new Error("Failed to fetch stays data.");
        }
        const data = await response.json();

        const filteredstays = data.locations.filter(
          (location) => location.categoryId === 5
        );
        setStays(filteredstays);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchstays();
  }, []);

  const calculateAverageScore = (locationScore) => {
    if (!locationScore || locationScore.length === 0) return 0;

    const totalScore = locationScore.reduce(
      (sum, score) => sum + score.score,
      0
    );
    return totalScore / locationScore.length;
  };

  // ฟังก์ชันสำหรับกรองสถานที่ตามราคา
  const handleFilterByPrice = () => {
    setFilterByPrice(!filterByPrice);
    const sortedStays = [...stays].sort((a, b) =>
      filterByPrice ? a.price - b.price : b.price - a.price
    );
    setStays(sortedStays);
  };

  // ฟังก์ชันสำหรับกรองสถานที่ตามคะแนน
  const handleFilterByRating = () => {
    setFilterByRating(!filterByRating);
    const sortedStays = [...stays].sort((a, b) => {
      const scoreA = calculateAverageScore(a.locationScore);
      const scoreB = calculateAverageScore(b.locationScore);
      return filterByRating ? scoreA - scoreB : scoreB - scoreA;
    });
    setStays(sortedStays);
  };

  return (
    <div>
      <div className="font-kanit bg-gradient-to-b from-gray-200 to-white animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
            {t("staypage")}
            <FaHotel className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
          </h2>
          <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto rounded-lg"></div>
        </div>

        {/* ปุ่มตัวกรอง */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={handleFilterByPrice}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ${
              filterByPrice
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <FaFilter className="mr-2" />
            {filterByPrice ? "ราคาสูง-ต่ำ" : "ราคาต่ำ-สูง"}
          </button>
          <button
            onClick={handleFilterByRating}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ${
              filterByRating
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <FaFilter className="mr-2" />
            {filterByRating ? "คะแนนสูง-ต่ำ" : "คะแนนต่ำ-สูง"}
          </button>
        </div>

        {loading && (
          <p className="text-xl font-bold text-center">{t("loading")}</p>
        )}
        {error && (
          <p className="text-xl font-bold text-center text-red-500">
            {t("error_loading_data")}
          </p>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {stays.map((stay, index) => {
              const averageScore = calculateAverageScore(stay.locationScore);

              return (
                <div
                  key={stay.locationId}
                  className={`relative bg-white border rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl opacity-0 translate-y-10 delay-${
                    index * 200
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative group">
                    <img
                      src={
                        stay.locationImg[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={stay.name}
                      className="w-full h-48 object-cover"
                    />
                    <Link
                      to={`/stays/${stay.locationId}`}
                      className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-medium"
                    >
                      {t("see_more")}
                    </Link>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                      {stay.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-2xl">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-yellow-500 ${
                                i < averageScore ? "opacity-100" : "opacity-30"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </span>
                        <span className="text-gray-600 ml-3">
                          ({averageScore.toFixed(1) || 0})
                        </span>
                      </div>
                      <span className="text-gray-800 text-sm font-bold">
                        ราคาที่พักต่อคืน : ฿{stay.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {stay.description.length > 100
                        ? `${stay.description.substring(0, 100)}...`
                        : stay.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AddedPlacesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
      />
      <button
        className="fixed bottom-8 right-8 bg-green-500 text-white p-6 rounded-full shadow-lg hover:bg-green-600 duration-200 animate-bounce z-[1000]"
        onClick={() => setIsModalOpen(true)}
      >
        <FaMap className="text-2xl" />
        {selectedPlaces.length > 0 && (
          <span className="absolute -top-2 -right-0 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {selectedPlaces.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default Cafepage;