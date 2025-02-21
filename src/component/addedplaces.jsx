import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import { AnimatePresence, motion } from "framer-motion";

const AddedPlacesModal = ({
  isOpen,
  onClose,
  selectedPlaces,
  setSelectedPlaces,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // สร้าง instance ของ navigate
  const API_URL = import.meta.env.VITE_API_URL;


  if (!isOpen) return null;

  const handleConfirm = async () => {
    const locationIds = selectedPlaces.map((place) => place.locationId);
    const selectedPlanId = localStorage.getItem("selectedPlanId");
    const selectedPlanID = parseInt(selectedPlanId, 10);

    if (!selectedPlanId) {
      console.error("Plan ID not found");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/plan/plan-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId: locationIds,
          planId: selectedPlanID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the plan");
      }

      const data = await response.json();
      console.log("Plan saved successfully", data);

      // นำทางไปที่ /plans
      navigate("/plans");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemove = (id) => {
    setSelectedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.locationId !== id)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-7/12">
        <h2 className="text-xl font-bold mb-4">{t("added_places")}</h2>
        <div className="max-h-60 overflow-y-auto">
          {selectedPlaces.length > 0 ? (
            selectedPlaces.map((place) => (
              <AnimatePresence>
                <motion.div
                  key={place.locationId}
                  className="flex items-center mb-2"
                  initial={{ opacity: 0, scale: 0.8 }} // เริ่มต้นเล็กและจาง
                  animate={{ opacity: 1, scale: 1 }} // ค่อยๆ ขยายขึ้น
                  exit={{ opacity: 0, scale: 0.8 }} // ค่อยๆ หายไปเมื่อถูกลบ
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center">
                    <img
                      src={place.locationImg[0].url}
                      alt={place.name}
                      className="w-24 h-24 object-cover rounded-md mr-3 mt-2"
                    />
                    <span className="text-gray-800">{place.name}</span>
                  </div>
                  <button
                    className="ml-auto text-red-500 hover:text-red-600 font-semibold text-3xl mr-4"
                    onClick={() => handleRemove(place.locationId)}
                  >
                    -
                  </button>
                </motion.div>
              </AnimatePresence>
            ))
          ) : (
            <p className="text-gray-500">{t("no_added_places")}</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            {t("close")}
          </button>
          {selectedPlaces.length > 0 && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleConfirm}
            >
              {t("confirm")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddedPlacesModal;
