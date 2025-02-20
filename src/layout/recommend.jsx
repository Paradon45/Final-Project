import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMap } from "react-icons/fa";
import { useToast } from "../component/ToastComponent";
import AddedPlacesModal from "../component/addedplaces";

const SearchSection = ({ onSearch }) => {
  const [budget, setBudget] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { t } = useTranslation();
  


  const handleSearch = () => {
    onSearch({ budget, categoryId });
  };

  return (
    <div className="animate-fadeInDelay2 font-kanit bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-11 w-6/12 mx-auto">
      <select
        className="border p-2 rounded-md"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option value="">{t("budget")}</option>
        <option value="LOW">{t("low")}</option>
        <option value="MEDIUM">{t("medium")}</option>
        <option value="HIGH">{t("high")}</option>
      </select>
      <select
        className="border p-2 rounded-md"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">{t("ph_category")}</option>
        <option value="1">{t("nature")}</option>
        <option value="2">{t("temples")}</option>
        <option value="3">{t("markets")}</option>
        <option value="4">{t("cafepage")}</option>
        <option value="5">{t("staypage")}</option>
        <option value="6">{t("others")}</option>
      </select>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 duration-200"
        onClick={handleSearch}
      >
        {t("search")}
      </button>
    </div>
  );
};

const PlaceCard = ({ place, onAdd }) => {
  const { t } = useTranslation();
  return (
    <div className="animate-fadeIn3Delay1 font-kanit bg-white shadow-lg rounded-lg p-4 w-80">
      <img
        src={place.locationImg[0].url}
        alt={place.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="mt-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-yellow-500 ${
                i < place.averageScore ? "opacity-100" : "opacity-30"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded mt-2">
          {place.category.name}
        </span>
        <h3 className="text-lg font-bold mt-2">{place.name}</h3>

        <button
          className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md w-full hover:bg-orange-600 duration-200"
          onClick={() => onAdd(place)}
        >
          {t("addplans")}
        </button>
      </div>
    </div>
  );
};

const SeeMorePage = () => {
  const { ToastComponent, showToast } = useToast();
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async (filters) => {
    try {
      const response = await fetch(`${API_URL}/location/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        if (response.status === 400) {
          showToast(t("error_budget"));
          return;
        }
        showToast(t("unknown_error"));
        return;
      }
      const data = await response.json();
      setFilteredPlaces(data.recommendedLocations);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast(t("fetch_error"));
    }
  };

  const handleAddToPlan = (place) => {
    setSelectedPlaces((prevSelectedPlaces) => {
      if (!prevSelectedPlaces.find((p) => p.locationId === place.locationId)) {
        return [...prevSelectedPlaces, place];
      }
      showToast(t("already_in_plan"));
      return prevSelectedPlaces;
    });
  };

  return (
    <div>
      {ToastComponent}
      <div className="animate-fadeIn font-kanit p-8 bg-gradient-to-b from-gray-200 to-white min-h-screen md:p-16 max-w-7xl mx-auto">
        <div className="text-center mb-11">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
            {t("recommendpage")}
            <FaMap className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
          </h2>
          <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>
          <SearchSection onSearch={handleSearch} />
        </div>
        <div className="relative w-full flex justify-end mt-3">
          <div className="relative inline-block ">
            <button
              className="bg-green-500 text-white text-lg px-4 py-3 font-semibold rounded-md mb-4 hover:bg-green-600 duration-200 relative"
              onClick={() => setIsModalOpen(true)}
            >
              {t("added_places")}
            </button>
            {selectedPlaces.length > 0 && (
              <span className="animate-fadeIn2 absolute  -top-2 -right-2 bg-red-500 text-white text-base font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {selectedPlaces.length}
              </span>
            )}
          </div>
        </div>

        {filteredPlaces.length > 0 && (
          <div className="animate-fadeIn2Delay1 mb-8">
            <h2 className="text-3xl font-bold mb-4">{t("attractions")}</h2>

            <div
              className="bg-gray-100 overflow-x-auto max-w-full p-7 border border-gray-200 rounded-lg shadow-inner"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e0 #f7fafc",
              }}
            >
              <div
                className="flex gap-6 flex-nowrap scroll-smooth"
                style={{ minWidth: "100%", scrollSnapType: "x mandatory" }}
              >
                {filteredPlaces.map((place) => (
                  <div
                    key={place.locationId}
                    className="scroll-snap-align-start"
                  >
                    <PlaceCard place={place} onAdd={handleAddToPlan} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <AddedPlacesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedPlaces={selectedPlaces}
          setSelectedPlaces={setSelectedPlaces}
        />
        <div className="mb-6 mt-4 w-11/12 h-1 rounded-lg bg-gray-300 mx-auto"></div>
      </div>
      {!isAuthenticated && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex flex-col items-center justify-center">
          <p className="animate-fadeIn font-kanit text-2xl font-bold text-red-600 bg-white p-4 rounded-md shadow-lg">
            {t("please_login")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SeeMorePage;
