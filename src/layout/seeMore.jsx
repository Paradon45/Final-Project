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
      <header className="text-center mb-10 py-6">
        <div className="container mx-auto px-4 text-center ">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
            {locations[0]?.category?.name || t("loading")}
            
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
          {/* ปุ่มกลับ */}
          <div className="text-left mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow animate-fadeIn"
          >
            {t("back")}
          </button>
          </div>
        </div>
      </header>

      <section className="bg-white py-12">
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
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <div
                      key={location.locationId}
                      className={`flex items-center bg-gray-100 rounded-lg shadow-md p-4 transform transition-all opacity-0 animate-fadeIn`}
                            style={{
                              animationDelay: `${index * 0.2}s`,
                            }}
                    >
                      <img
                        src={location.locationImg[0]?.url || "/placeholder.jpg"}
                        alt={location.name}
                        className="w-32 h-32 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-grow">
                        <Link
                          to={`/viewpoint/${location.locationId}`}
                            className=""
                            >
                          <div className="text-xl font-bold text-red-600">
                        
                          {location.name}

                          </div>
                        
                        <p className="text-gray-600 mt-2">
                          {location.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★★★★☆</span>
                          <span className="text-gray-600 ml-2">
                            ({location.rating || "4.0"})
                          </span>
                        </div>
                        </Link>
                      </div>
                    </div>
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
