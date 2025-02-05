import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Landing = () => {
  const { categoryId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: "", name: t("all_locations") },
    { id: "1", name: t("nature") },
    { id: "2", name: t("temples") },
    { id: "3", name: t("markets") },
    { id: "4", name: t("others") },
    { id: "5", name: t("cafepage") },
    { id: "6", name: t("staypage") },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/location/landing");
        if (!response.ok) {
          throw new Error("Failed to fetch locations data.");
        }
        const data = await response.json();
        setLocations(data.locations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const filterByCategory = () => {
      const filtered = locations.filter((location) => {
        const matchesCategory = categoryId
          ? location.categoryId.toString() === categoryId
          : true;
        const matchesSearch = location.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      setFilteredLocations(filtered);
    };

    filterByCategory();
  }, [locations, categoryId, searchQuery]);

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-gray-100 animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      {/* Header */}
      <header className="text-center mb-4 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex justify-center items-center">
            {t("locations")}
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </div>
        <Link 
        to={`/attractions`}
        >
        <div className="text-left mt-4">
          <button
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200"
          >
            {t("back")}
          </button>
        </div>
        </Link>
      </header>

      {/* Filters */}
      <nav className="flex justify-center mb-6 space-x-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/landing/${category.id || ""}`)}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200 ${
              categoryId === category.id
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("ph_seach")}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring focus:ring-orange-300"
        />
      </div>

      {/* Main Section */}
      <section className="bg-white py-12 rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center">{t("loading")}</p>}
          {error && (
            <p className="text-center text-red-500">{t("error_loading_data")}</p>
          )}
          {!loading && !error && (
            <>
              {filteredLocations.length === 0 ? (
                <p className="text-center text-gray-500">
                  {t("no_locations_in_category")}
                </p>
              ) : (
                <div
                  className="overflow-y-auto max-h-[500px] space-y-6 p-7 border border-gray-200 rounded-lg shadow-inner"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e0 #f7fafc" }}
                >
                  {filteredLocations.map((location) => (
                    <Link
                      to={`/viewpoint/${location.locationId}`}
                      key={location.locationId}
                    >
                      <div className="mb-4 flex items-center bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transform transition duration-200 hover:scale-105">
                        {/* Image */}
                        <img
                          src={location.locationImg[0]?.url || "/placeholder.jpg"}
                          alt={location.name}
                          className="w-32 h-32 object-cover rounded-lg mr-4"
                        />
                        {/* Details */}
                        <div className="flex-grow">
                          <div className="text-xl font-bold text-red-600">
                            {location.name}
                          </div>
                          <p className="text-gray-600 mt-2 mr-2 line-clamp-2">
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

export default Landing;
