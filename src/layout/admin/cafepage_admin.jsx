import React, { useEffect, useState } from "react";
import { FaCoffee } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaMap } from "react-icons/fa";

const CafepageAdmin = () => {
  const { t } = useTranslation();
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCafes = async () => {
      try {
        const response = await fetch(`${API_URL}/location/landing`);
        if (!response.ok) {
          throw new Error("Failed to fetch cafes data.");
        }
        const data = await response.json();

        const filteredCafes = data.locations.filter(
          (location) => location.categoryId === 4
        );
        setCafes(filteredCafes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  // ฟังก์ชันคำนวณคะแนนเฉลี่ย
  const calculateAverageScore = (locationScore) => {
    if (!locationScore || locationScore.length === 0) return 0;

    const totalScore = locationScore.reduce(
      (sum, score) => sum + score.score,
      0
    );
    return totalScore / locationScore.length;
  };

  return (
    <div>
      <div className="font-kanit bg-gradient-to-b from-gray-200 to-white animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
            {t("cafepage")}
            <FaCoffee className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
          </h2>
          <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto rounded-lg"></div>
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
            {cafes.map((cafe, index) => {
              const averageScore = calculateAverageScore(cafe.locationScore); // คำนวณคะแนนเฉลี่ย

              return (
                <div
                  key={cafe.locationId}
                  className={`relative bg-white border rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl opacity-0 translate-y-10 delay-${
                    index * 200
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative group">
                    <img
                      src={
                        cafe.locationImg[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={cafe.name}
                      className="w-full h-48 object-cover"
                    />
                    <Link
                      to={`/cafeadmin/${cafe.locationId}`}
                      className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-medium"
                    >
                      {t("see_more")}
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {t("cafepage")}
                      </span>
                      <GiForkKnifeSpoon className="text-gray-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mt-2">
                      {cafe.name}
                    </h3>
                    <span className="text-yellow-500 text-2xl">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-yellow-500 ${
                            i < cafe.averageScore ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span className="text-gray-600 ml-3">
                      ({averageScore.toFixed(1)}){" "}
                      {/* แสดงคะแนนเฉลี่ยทศนิยม 1 ตำแหน่ง */}
                    </span>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {cafe.description.length > 100
                        ? `${cafe.description.substring(0, 100)}...`
                        : cafe.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CafepageAdmin;
