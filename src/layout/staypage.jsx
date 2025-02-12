import React, { useEffect, useState } from "react";
import { FaHotel } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Cafepage = () => {
  const { t } = useTranslation();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchstays = async () => {
      try {
        const response = await fetch("http://localhost:8000/location/landing");
        if (!response.ok) {
          throw new Error("Failed to fetch stays data.");
        }
        const data = await response.json();
        
        const filteredstays = data.locations.filter(location => location.categoryId === 6);
        setStays(filteredstays);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchstays();
  }, []);

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-white animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
          {t("staypage")}
          <FaHotel className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-lg"></div>
      </div>

      {loading && <p className="text-xl font-bold text-center">{t("loading")}</p>}
      {error && <p className="text-xl font-bold text-center text-red-500">{t("error_loading_data")}</p>}
      
      {!loading && !error && (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {stays.map((stay, index) => (
            <div
              key={stay.locationId}
              className={`relative bg-white border rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl opacity-0 translate-y-10 delay-${index * 200} animate-fadeIn`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative group">
                <img
                  src={stay.locationImg[0]?.url || "https://via.placeholder.com/300"}
                  alt={stay.name}
                  className="w-full h-48 object-cover"
                />
                <Link to={`/stays/${stay.locationId}`} className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white text-lg font-medium">
                  {t("see_more")}
                </Link>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mt-2">
                  {stay.name}
                </h3>
                <span className="text-yellow-500 text-2xl">★★★★★</span>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                {stay.description.length > 100 ? `${stay.description.substring(0, 100)}...` : stay.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cafepage;
