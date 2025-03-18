import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMap } from "react-icons/fa"; // นำเข้าไอคอน
import { useToast } from "../component/ToastComponent";
import AddedPlacesModal from "../component/addedplaces";
import PlanSelectionModal from "../component/PlanSelectionModal";
import ML from "../component/ml";
import { Button } from "antd";

const PlaceCard = ({ place, onAdd }) => {
  const { t } = useTranslation();
  const calculateAverageScore = (locationScore) => {
    if (!locationScore || locationScore.length === 0) return 0;

    const totalScore = locationScore.reduce(
      (sum, score) => sum + score.score,
      0
    );
    return totalScore / locationScore.length;
  };

  const averageScore = calculateAverageScore(place.locationScore);
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
                i < averageScore ? "opacity-100" : "opacity-30"
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
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const [isMLOpen, setIsMLOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const userId = localStorage.getItem("userID");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      console.log("Selected Plan ID:", selectedPlan);
      localStorage.setItem("selectedPlanId", selectedPlan);
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedPlan) {
      const selectedPlanData = plans.find(
        (plan) => plan.planId === selectedPlan
      );
      if (selectedPlanData) {
        setSelectedPlanName(selectedPlanData.name);
      }
    }
  }, [selectedPlan, plans]);

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPlans(data.plans || []);
      } catch (error) {
        console.error("Error fetching user plans:", error);
      }
    };

    if (userId) fetchUserPlans();
  }, [userId]);

  // ฟังก์ชันดึงข้อมูลสถานที่ทั้งหมด
  const fetchAllPlaces = async () => {
    try {
      const response = await fetch(`${API_URL}/location/landing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // กรองสถานที่ที่มี categoryId = 5 ออก
      const filteredData = data.locations
      setAllPlaces(filteredData);
      setFilteredPlaces(filteredData);
    } catch (error) {
      console.error("Error fetching all places:", error);
      showToast(t("fetch_error"));
    }
  };

  useEffect(() => {
    fetchAllPlaces();
  }, []);

  // ฟังก์ชันกรองสถานที่ตามประเภท
  const handleFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "") {
      setFilteredPlaces(allPlaces); // ถ้าไม่เลือกประเภท ให้แสดงทั้งหมด (ไม่รวม categoryId = 5)
    } else {
      const filtered = allPlaces.filter(
        (place) => place.category.categoryId === parseInt(categoryId, 10)
      );
      setFilteredPlaces(filtered);
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
    <div className="font-kanit">
      {ToastComponent}
      <div className="animate-fadeIn  p-8 bg-gradient-to-b from-gray-200 to-white min-h-screen md:p-16 max-w-7xl mx-auto">
        <div className="text-center mb-11">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
            {t("recommendpage")}
            <FaMap className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
          </h2>
          <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>
          {selectedPlanName && (
            <div className="mt-5">
              <h3 className="text-2xl font-bold">
                {t("selected_plan")} : {selectedPlanName}
              </h3>
              <button onClick={() => setShowModal(true)} className="text-blue-600 hover:text-blue-400 transition duration-200">{t("openselect_plan")}</button>
            </div>
          )}
        </div>
        <div className="relative w-full flex justify-end mt-1">
          <div className="relative inline-block ">
            <Button
              type="primary"
              className="font-kanit"
              onClick={() => setIsMLOpen(true)}
            >
              Open Recommendation
            </Button>
            <ML isOpen={isMLOpen} onClose={() => setIsMLOpen(false)} />
          </div>
        </div>

        {/* ปุ่มกรองประเภทสถานที่ */}
        <div className="mb-6">
          <select
            className="border p-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">{t("ph_category")}</option>
            <option value="1">{t("nature")}</option>
            <option value="2">{t("temples")}</option>
            <option value="3">{t("markets")}</option>
            <option value="4">{t("cafepage")}</option>
            <option value="5">{t("staypage")}</option>
            <option value="6">{t("others")}</option>
          </select>
        </div>

        {/* แสดงสถานที่ในรูปแบบแนวตั้ง */}
        {filteredPlaces.length > 0 && (
          <div className="animate-fadeIn2Delay1 mb-8">
            <h2 className="text-3xl font-bold mb-4">{t("attractions")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <div key={place.locationId}>
                  <PlaceCard place={place} onAdd={handleAddToPlan} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-6 mt-4 w-11/12 h-1 rounded-lg bg-gray-300 mx-auto"></div>
      </div>

      <AddedPlacesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
      />
      <button
        className="fixed bottom-8 right-8 bg-green-500 text-white p-6 rounded-full shadow-lg hover:bg-green-600 duration-200 animate-bounce z-[1000]"
        onClick={() => setIsModalOpen(true)}
      >
        <FaMap className="text-2xl" />
        {selectedPlaces.length > 0 && (
          <span className="absolute -top-2 -right-0 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {selectedPlaces.length}
          </span>
        )}
      </button>

      
         <PlanSelectionModal
         isOpen={showModal}
         onClose={() => setShowModal(false)}
         userId={userId}
         onSelectPlan={(planId) => {
           setSelectedPlan(planId);
           setShowModal(false);
         }}
       />
      

      {!isAuthenticated && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center">
          <p className="animate-fadeIn font-kanit text-2xl font-bold text-red-600 bg-white p-4 rounded-md shadow-lg">
            {t("please_login")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SeeMorePage;
