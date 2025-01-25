import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SeeMore = () => {
  const { categoryId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/location/landing");
        if (!response.ok) {
          throw new Error("Failed to fetch locations data.");
        }
        const data = await response.json();

        // Filter locations by categoryId
        const filteredLocations = data.locations.filter(
          (location) => location.categoryId.toString() === categoryId
        );

        setLocations(filteredLocations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocations();
  }, [categoryId]);

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-gray-100 animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      {/* Header */}
      <header className="text-center mb-4 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex justify-center items-center">
            {locations[0]?.category?.name || t("loading")}
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </div>
        <div className="text-left mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200"
          >
            {t("back")}
          </button>
        </div>
      </header>

      {/* Main Section */}
      <section className="bg-white py-12 rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center">{t("loading")}</p>}
          {error && (
            <p className="text-center text-red-500">
              {t("error_loading_data")}
            </p>
          )}
          {!loading && !error && (
            <>
              {locations.length === 0 ? (
                <p className="text-center text-gray-500">
                  {t("no_locations_in_category")}
                </p>
              ) : (
                <div
                  className="overflow-y-auto max-h-[500px] space-y-6 p-7 border border-gray-200 rounded-lg shadow-inner"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e0 #f7fafc" }}
                >
                  {locations.map((location) => (
                     <Link
                     to={`/viewpoint/${location.locationId}`}
                     
                   >
                    <div
                      key={location.locationId}
                      className="mb-4 flex items-center bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transform transition duration-200 hover:scale-105"
                    >
                      {/* Image */}
                      <img
                        src={location.locationImg[0]?.url || "/placeholder.jpg"}
                        alt={location.name}
                        className="w-32 h-32 object-cover rounded-lg mr-4"
                      />
                      {/* Details */}
                      <div className="flex-grow">
                        <div
                          className="text-xl font-bold text-red-600 "
                        >
                          {location.name}
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {location.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★★★★☆</span>
                          <span className="text-gray-600 ml-2">
                            ({location.rating || "4.0"})
                          </span>
                        </div>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SeeMore;
