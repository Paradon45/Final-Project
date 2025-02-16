import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMap } from "react-icons/fa";

const places = [
  {
    id: 1,
    name: "จุดชมวิวหินช้างสี",
    category: "ธรรมชาติ",
    image: "/images/viewpoint.jpg",
    rating: 4,
    season: "หน้าร้อน",
    budget: "ต่ำ",
    activity: "เดินป่า",
  },
  {
    id: 2,
    name: "พระมหาธาตุแก่นนคร พระธาตุ 9 ชั้น",
    category: "วัด",
    image: "/images/phra-maha-that.jpg",
    rating: 4,
    season: "หน้าหนาว",
    budget: "ปานกลาง",
    activity: "ไหว้พระ",
  },
  {
    id: 3,
    name: "เขื่อนอุบลรัตน์",
    category: "ธรรมชาติ",
    image: "/images/dam.jpg",
    rating: 4,
    season: "หน้าฝน",
    budget: "สูง",
    activity: "ถ่ายรูป",
  },
  {
    id: 4,
    name: "เขื่อนอุบลรัตน์",
    category: "ธรรมชาติ",
    image: "/images/dam.jpg",
    rating: 4,
    season: "หน้าฝน",
    budget: "สูง",
    activity: "ถ่ายรูป",
  },
];

const SearchSection = ({ onSearch }) => {
  const [season, setSeason] = useState("");
  const [budget, setBudget] = useState("");
  const [activity, setActivity] = useState("");
  const { t } = useTranslation();

  const handleSearch = () => {
    onSearch({ season, budget, activity });
  };

  return (
    <div className="animate-fadeInDelay2 font-kanit bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-9 w-9/12 mx-auto">
      <select
        className="ml-3 border p-2 rounded-md "
        value={season}
        onChange={(e) => setSeason(e.target.value)}
      >
        <option value="">เลือกฤดู</option>
        <option value="หน้าร้อน">หน้าร้อน</option>
        <option value="หน้าหนาว">หน้าหนาว</option>
        <option value="หน้าฝน">หน้าฝน</option>
      </select>
      <select
        className="border p-2 rounded-md "
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option value="">เลือกงบประมาณ</option>
        <option value="ต่ำ">ต่ำ</option>
        <option value="ปานกลาง">ปานกลาง</option>
        <option value="สูง">สูง</option>
      </select>
      <select
        className="border p-2 rounded-md "
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
      >
        <option value="">เลือกกิจกรรม</option>
        <option value="เดินป่า">เดินป่า</option>
        <option value="ไหว้พระ">ไหว้พระ</option>
        <option value="ถ่ายรูป">ถ่ายรูป</option>
      </select>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 duration-200"
        onClick={handleSearch}
      >
        {t("seach")}
      </button>
    </div>
  );
};

const PlaceCard = ({ place }) => {
  const { t } = useTranslation();
  return (
    <div className="animate-fadeIn3Delay1 font-kanit bg-white shadow-lg rounded-lg p-4 w-80">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="mt-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-yellow-500 ${
                i < place.rating ? "opacity-100" : "opacity-30"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded mt-2">
          {place.category}
        </span>
        <h3 className="text-lg font-bold mt-2">{place.name}</h3>
        <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md w-full">
          {t("addplans")}
        </button>
      </div>
    </div>
  );
};

const SeeMorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const { t } = useTranslation();

  const handleSearch = (filters) => {
    const results = places.filter(
      (place) =>
        (!filters.season || place.season === filters.season) &&
        (!filters.budget || place.budget === filters.budget) &&
        (!filters.activity || place.activity === filters.activity)
    );
    setFilteredPlaces(results);
  };

  return (
    <div className="animate-fadeIn font-kanit p-8 bg-gradient-to-b from-gray-200 to-white min-h-screen md:p-16 max-w-7xl mx-auto">
      {/* Search Section */}
      <div className="text-center mb-11">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
          {t("recommendpage")}
          <FaMap className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h2>
        <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>
        <SearchSection onSearch={handleSearch} />
      </div>

      {/* Places Section */}
      {filteredPlaces.length > 0 && (
        <div className="animate-fadeIn2Delay1 mb-8">
          <h2 className="text-3xl font-bold mb-4">{t("attractions")}</h2>
          <div className="flex justify-end">
            <button className="bg-gray-300 px-4 py-2 mb-4 rounded-md">
              {t("filter")}
            </button>
          </div>

          {/* ช่องแสดงผลที่เลื่อนได้ */}
          <div
            className="bg-gray-100 overflow-x-auto max-w-full p-7 border border-gray-200 rounded-lg shadow-inner"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e0 #f7fafc",
            }}
          >
            <div
              className="flex gap-6 flex-nowrap scroll-smooth"
              style={{
                minWidth: "100%", // ป้องกันช่องว่างถ้ายังไม่มีข้อมูล
                scrollSnapType: "x mandatory", // ทำให้เลื่อนได้แบบ smooth
              }}
            >
              {filteredPlaces.map((place) => (
                <div key={place.id} className="scroll-snap-align-start">
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 mt-4 w-11/12 h-1 rounded-lg bg-gray-300 mx-auto"></div>
    </div>
  );
};

export default SeeMorePage;
