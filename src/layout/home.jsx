import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "../component/ToastComponent";
import myImage from "../photo/20180328812f8494092d52cc3373d93baeb9e966115448.jpg";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [locations, setLocations] = useState([]);
  const {ToastComponent, showToast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchLocations();
  }, []);

  // ดึงข้อมูลสถานที่ทั้งหมด
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/location/landing");
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      setLocations(data.locations); // ✅ เก็บข้อมูลทั้งหมด
    } catch (error) {
      console.error(error);
    }
  };

  // อัปเดตคำแนะนำเมื่อพิมพ์
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = locations.filter((loc) =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // ค้นหาข้อมูลจาก state แล้ว route ตาม categoryId
  const handleSearchSubmit = () => {
    const foundLocation = locations.find(
      (loc) => loc.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundLocation) {
      const { locationId, categoryId } = foundLocation;

      if ([1, 2, 3, 4].includes(categoryId)) {
        navigate(`/viewpoint/${locationId}`);
      } else if (categoryId === 5) {
        navigate(`/cafes/${locationId}`);
      } else if (categoryId === 6) {
        navigate(`/stays/${locationId}`);
      } else {
        showToast(t("unknown_error"));
      }
    } else {
      showToast(t("no_locations"));
    }
  };

  // กด Enter เพื่อค้นหา
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // คลิกเลือกคำแนะนำ
  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setSuggestions([]);
  };

  return (
    <div className="font-kanit relative text-white">
      {ToastComponent}
      <header
        className="animate-fadeInDelay1 relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${myImage})` }}
      >
        <div className="animate-fadeInDelay2 absolute top-0 left-0 w-full h-full flex flex-col items-start justify-start p-12">
          <h1
            className="text-8xl font-bold mb-4 mt-5"
            style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)" }}
          >
            Discover Khon Kaen
          </h1>
          <p className="text-xl mb-6 font-bold">{t("headers")}</p>
          <p className="text-lg mb-6 max-w-md">{t("des")}</p>

          {/* ✅ ช่อง Search */}
          <div className="relative w-full max-w-md">
            <div className="flex items-center w-full max-w-md mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} // ✅ เพิ่ม event เมื่อกด Enter
                placeholder={t("ph_search")}
                className="flex-1 px-4 py-2 w-full rounded-l-md border border-gray-300 outline-none text-black"
              />
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-white hover:bg-gray-200 rounded-r-md text-gray-400 border border-gray-300"
              >
                {t("search")}
              </button>
            </div>

            {/* ✅ Dropdown คำแนะนำ */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white text-black border rounded-md mt-1 max-h-40 overflow-y-auto">
                {suggestions.map((loc) => (
                  <li
                    key={loc.locationId}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(loc.name)}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
