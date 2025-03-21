import { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaTrash, FaMap } from "react-icons/fa";
import { useToast } from "../component/ToastComponent";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Googlemap from "./googlemaptest";
import Googlemapcurrent from "./googlemapcurrent";
import PlanSelectionModal from "../component/PlanSelectionModal";
import AddedBudgetModal from "../component/addedbudget";
import { Select } from "antd"; // นำเข้า Select จาก Ant Design

const { Option } = Select;

function TripPlanner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [locationPlans, setLocationPlans] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [isPlanValid, setIsPlanValid] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [travelCost, setTravelCost] = useState(null);
  const [showGoogleMap, setShowGoogleMap] = useState(() => {
    // เรียกค่า state จาก localStorage เมื่อโหลดหน้า
    const storedShowGoogleMap = localStorage.getItem("showGoogleMap");
    return storedShowGoogleMap ? JSON.parse(storedShowGoogleMap) : true;
  });
  const [selectedDay, setSelectedDay] = useState(null); // เพิ่ม state สำหรับเลือกวัน
  const [planDays, setPlanDays] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลวัน

  const userIdString = localStorage.getItem("userID");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  const API_URL = import.meta.env.VITE_API_URL;

  // ดึงข้อมูลแผนการเดินทางและวัน
  useEffect(() => {
    const fetchPlanAndDays = async () => {
      if (!selectedPlan) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plan/${selectedPlan}`, {
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

        if (data.plan.userId !== userId) {
          setIsPlanValid(false);
          return;
        }

        setIsPlanValid(true);
        setPlanDays(data.plan.planDays); // เก็บข้อมูลวัน
        setSelectedPlanName(data.plan.name);

        // กรองสถานที่ตามวันที่เลือก
        const selectedDayData = data.plan.planDays.find(
          (day) => day.day === selectedDay
        );
        const locations = selectedDayData
          ? selectedDayData.locations.map((loc) => ({
              locationId: loc.locationId,
              name: loc.location.name,
              imageUrl: loc.location.locationImg[0]?.url || "",
            }))
          : [];
        setLocationPlans(locations);
      } catch (error) {
        console.error("Error fetching plan locations:", error);
      }
    };

    fetchPlanAndDays();
  }, [selectedPlan, selectedDay]); // เพิ่ม selectedDay เป็น dependency

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const storedSelectedPlanId = localStorage.getItem("selectedPlanId");
    if (storedSelectedPlanId) {
      setSelectedPlan(storedSelectedPlanId);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      console.log("Selected Plan ID:", selectedPlan);
      localStorage.setItem("selectedPlanId", selectedPlan);
    }
  }, [selectedPlan]);

  useEffect(() => {
    // บันทึก state showGoogleMap ลงใน localStorage เมื่อมีการเปลี่ยนแปลง
    localStorage.setItem("showGoogleMap", JSON.stringify(showGoogleMap));
  }, [showGoogleMap]);

  // ฟังก์ชันลบสถานที่
  const handleDeleteLocation = async (locationId) => {
    if (!selectedDay) {
      alert("กรุณาเลือกวันที่ก่อน");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const planDayId = planDays.find((day) => day.day === selectedDay)?.id; // หา planDayId จากวันที่เลือก
      if (!planDayId) {
        throw new Error("Plan Day ID not found");
      }

      const response = await fetch(
        `${API_URL}/plan/${selectedPlan}/planDays/${planDayId}/locations/${locationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // อัปเดตสถานที่ในแผนการเดินทางหลังจากลบสำเร็จ
      setLocationPlans((prevLocations) =>
        prevLocations.filter((loc) => loc.locationId !== locationId)
      );

      showToast("ลบสถานที่สำเร็จ!");
      window.location.reload(); // Reload หน้าเพื่ออัปเดตข้อมูล
    } catch (error) {
      console.error("Error deleting location:", error);
      showToast("เกิดข้อผิดพลาดในการลบสถานที่");
    }
  };

  const handleSaveTravelCost = (cost) => {
    setTravelCost(cost); // เก็บค่าเดินทาง
  };

  const { ToastComponent, showToast } = useToast();
  const { t } = useTranslation();

  return (
    <div className="font-kanit">
      {ToastComponent}
      <div className="animate-fadeIn max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-4 md:p-16">
        <h1 className="text-4xl font-bold text-center mb-6 flex justify-center items-center">
          {t("tripplanner")}
          <FaMapMarkedAlt className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h1>
        <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>
        {selectedPlanName && (
          <div className="mt-5">
            <h3 className="text-2xl font-bold">
              {t("selected_plan")} : {selectedPlanName}
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="ml-2 mb-5 text-blue-600 hover:text-blue-400 transition duration-200"
            >
              {t("openselect_plan")}
            </button>
          </div>
        )}

        {/* เลือกวัน */}
        {planDays.length > 0 && (
          <div className="mb-4 w-48">
            <Select
              placeholder={t("select_day")}
              onChange={(value) => {
                setSelectedDay(value);
              }}
              className="w-full font-kanit"
            >
              {planDays.map((day) => (
                <Option key={day.id} value={day.day} className="font-kanit">
                  {t("day")} {day.day}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {!isPlanValid ? (
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">
              กรุณาสร้างแผนการเที่ยวที่หน้าแนะนำที่เที่ยวก่อน
            </p>
            <Link
              to="/recommend"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 duration-200"
            >
              ไปยังหน้าแนะนำที่เที่ยว
            </Link>
          </div>
        ) : locationPlans.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">
              โปรดเลือกแผนการเดินทางที่หน้าแนะนำที่เที่ยวก่อน
            </p>
            <Link
              to="/recommend"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 duration-200"
            >
              ไปยังหน้าแนะนำที่เที่ยว
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-300 bg-gray-100 rounded-lg p-2">
              <div className="flex flex-nowrap space-x-4">
                <AnimatePresence>
                  {locationPlans.map((loc, index) => (
                    <motion.div
                      key={index}
                      className="flex-none w-96 bg-gray-50 p-3 rounded-lg shadow"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={loc.imageUrl}
                          alt={loc.name}
                          className="w-64 h-24 rounded"
                        />
                        <span>{loc.name}</span>
                        <button
                          onClick={() => handleDeleteLocation(loc.locationId)}
                          className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ปุ่มสลับระหว่างแผนที่ */}
      {isAuthenticated && selectedPlan && (
        <div className="fixed top-20 right-8 flex flex-col space-y-4 z-[1000]">
          <button
            className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 duration-200"
            onClick={() => setShowGoogleMap(!showGoogleMap)}
          >
            {showGoogleMap ? "ค้นหาเส้นทางจากที่อยู่ปัจจุบัน" : "ค้นหาเส้นทางจากสถานที่"}
          </button>
        </div>
      )}

      {/* แสดงแผนที่ตาม state */}
      {showGoogleMap ? (
        <Googlemap onSaveTravelCost={handleSaveTravelCost} />
      ) : (
        <Googlemapcurrent onSaveTravelCost={handleSaveTravelCost} />
      )}

      <PlanSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        onSelectPlan={(planId) => {
          setSelectedPlan(planId);
          window.location.reload();
          setShowModal(false);
        }}
      />

      <AddedBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        travelCost={travelCost}
      />

      {isAuthenticated && selectedPlan && (
        <button
          className="fixed bottom-8 right-8 bg-orange-500 text-white p-6 rounded-full shadow-lg hover:bg-orange-600 duration-200 animate-bounce z-[1000]"
          onClick={() => setIsModalOpen(true)}
        >
          <FaMap className="text-2xl" />
          {travelCost !== null && (
            <span className="absolute -top-2 -right-0 bg-red-500 text-white text-lg rounded-full w-6 h-6 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      )}

      {!isAuthenticated && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-60 flex flex-col items-center justify-center ">
          <p className="animate-fadeIn font-kanit text-2xl font-bold text-red-600 bg-white p-4 rounded-md shadow-lg">
            {t("please_login")}
          </p>
        </div>
      )}
    </div>
  );
}

export default TripPlanner;