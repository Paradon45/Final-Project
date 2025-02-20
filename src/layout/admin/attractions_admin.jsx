import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import templeImage from "../../photo/location-2.jpg";

const Attractions = () => {
  const { t } = useTranslation();
  const [groupedAttractions, setGroupedAttractions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAttractions = async () => {
      try {
        const response = await fetch(`${API_URL}/location/landing`);
        if (!response.ok) {
          throw new Error("Failed to fetch attractions data.");
        }
        const data = await response.json();

        // Group attractions by categoryId and filter to include only categoryId 1-4
        const grouped = data.locations.reduce((acc, location) => {
          if ([1, 2, 3, 6].includes(location.categoryId)) {
            acc[location.categoryId] = acc[location.categoryId] || [];
            acc[location.categoryId].push(location);
          }
          return acc;
        }, {});
        setGroupedAttractions(grouped);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  return (
    <div className="font-kanit">
      <header
        className="relative h-[350px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${templeImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-start justify-center p-12 text-white">
          <h1
            className="animate-fadeIn3 text-6xl font-bold mb-4"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {t("attractions")}
          </h1>
          <p
            className="animate-fadeIn3Delay1 text-lg"
            style={{
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
            }}
          >
            {t("khonkaen")}
          </p>
        </div>
      </header>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
        {!loading && !error && (
          <Link to={`/landing`}>
            <div className="text-right mr-6">
              <button className="px-4 py-2 bg-gray-300 hover:bg-yellow-500 transition duration-300 text-gray-800 font-semibold rounded shadow animate-fadeIn3Delay1">
                {t("locations")}
              </button>
            </div>
          </Link>
          )}
          {loading && (
            <p className="text-xl font-bold text-center">{t("loading")}</p>
          )}
          {error && (
            <p className="text-xl font-bold text-center text-red-500">
              {t("error_loading_data")}
            </p>
          )}
          {!loading && !error && (
            <>
              {Object.entries(groupedAttractions).map(
                ([categoryId, locations]) => (
                  <div key={categoryId} className="mb-12">
                    <div className="flex flex-col md:flex-row items-center">
                      {/* Display the first image from the category */}
                      <img
                        src={
                          locations[0]?.locationImg[0].url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={locations[0]?.name || "Category Image"}
                        className="w-full h-80 object-cover md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0"
                      />
                      <div className="md:ml-8">
                        {/* Display category name */}
                        <h2 className="text-5xl text-red-600 font-bold mb-4">
                          {locations[0]?.category.name || t("category")}
                        </h2>
                        <div className="w-50 h-1 bg-gray-200 mt-4 rounded-lg"></div>
                        {/* Display locations in the category */}
                        <div>
                          {locations.slice(0, 4).map((attraction, index) => (
                            <ul
                              key={index}
                              className={`text-gray-700 text-base space-y-2 relative transform transition-all opacity-0 animate-fadeIn3Delay1`}
                              style={{
                                animationDelay: `${index * 0.2}s`,
                              }}
                            >
                              <Link
                                to={`/viewpoint/${attraction.locationId}`}
                                className="block hover:text-yellow-500 transition duration-300 mt-2 "
                              >
                                ➤ {attraction.name}
                              </Link>
                            </ul>
                          ))}
                          {/* Always show "See More" button */}
                          <Link
                            to={`/seemore/${categoryId}`}
                            className="block text-gray-700 hover:text-yellow-500 duration-300 pt-2 transform transition-all opacity-0 animate-fadeIn3Delay1"
                            style={{
                              animationDelay: `${4 * 0.2}s`,
                            }}
                          >
                            ➤ {t("see_more")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Attractions;
