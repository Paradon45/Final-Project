import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMap } from "react-icons/fa";
import { useToast } from "../component/ToastComponent";
import { Drawer, Button, DatePicker } from "antd"; // Import DatePicker จาก Ant Design
import AddedPlacesModal from "../component/addedplaces"; // นำเข้า AddedPlacesModal

const SearchSection = ({ onSearch }) => {
  const [budget, setBudget] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dateRange, setDateRange] = useState([]); // State สำหรับเก็บวันที่ไปและวันที่กลับ
  const { t } = useTranslation();

  const handleSearch = () => {
    const [startDate, endDate] = dateRange;
    onSearch({
      budget,
      categoryId,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null, // ฟอร์แมตวันที่ให้เป็น "YYYY-MM-DD"
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null, // ฟอร์แมตวันที่ให้เป็น "YYYY-MM-DD"
    });
  };

  return (
    <div className="animate-fadeInDelay2 font-kanit bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-11 w-auto mx-auto">
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
      {/* เพิ่ม DatePicker.RangePicker สำหรับเลือกวันที่ไปและวันที่กลับ */}
      <DatePicker.RangePicker
        onChange={(dates) => setDateRange(dates)} // เมื่อวันที่เปลี่ยนแปลง
        format="YYYY-MM-DD" // ฟอร์แมตวันที่
      />
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

const ML = ({ isOpen, onClose }) => {
  const { ToastComponent, showToast } = useToast();
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]); // State สำหรับเก็บสถานที่ที่ถูกเพิ่ม
  const [isAddedPlacesModalOpen, setIsAddedPlacesModalOpen] = useState(false); // State สำหรับควบคุมการเปิดปิด AddedPlacesModal
  const { t } = useTranslation();

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
    <>
      <Drawer
        title={t("recommendpage")}
        placement="left"
        onClose={onClose}
        className="font-kanit"
        open={isOpen}
        width={1000}
        footer={
          <div className="flex justify-end">
            <Button onClick={onClose} className="mr-2 font-kanit">
              {t("close")}
            </Button>
          </div>
        }
      >
        <div className="font-kanit">
          {ToastComponent}
          <div className="animate-fadeIn p-8 bg-gradient-to-b from-gray-200 to-white min-h-screen md:p-16 max-w-7xl mx-auto">
            <div className="text-center mb-11">
              <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
                {t("recommendpage")}
                <FaMap className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
              </h2>
              <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>
              <SearchSection onSearch={handleSearch} />
            </div>
            <div className="relative w-full flex justify-end mt-1">
              <div className="relative inline-block ">
                <button
                  className="bg-green-500 text-white text-lg px-4 py-3 font-semibold rounded-md mb-4 hover:bg-green-600 duration-200 relative"
                  onClick={() => setIsAddedPlacesModalOpen(true)}
                >
                  {t("added_places")}
                </button>
                {selectedPlaces.length > 0 && (
                  <span className="animate-fadeIn2 absolute -top-2 -right-2 bg-red-500 text-white text-base font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
          </div>
        </div>
      </Drawer>

      {/* AddedPlacesModal */}
      <AddedPlacesModal
        isOpen={isAddedPlacesModalOpen}
        onClose={() => setIsAddedPlacesModalOpen(false)}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
      />
    </>
  );
};

export default ML;