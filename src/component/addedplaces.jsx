import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Drawer, Button, Checkbox } from "antd"; // นำเข้า Drawer, Button, และ Checkbox จาก Ant Design
import { FaTrash } from "react-icons/fa";

const AddedPlacesModal = ({
  isOpen,
  onClose,
  selectedPlaces,
  setSelectedPlaces,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // State สำหรับเก็บสถานที่ที่ถูกเลือก
  const [checkedPlaces, setCheckedPlaces] = useState([]);
  // State สำหรับเก็บราคารวม
  const [totalPrice, setTotalPrice] = useState(0);

  // คำนวณราคารวมทุกครั้งที่ checkedPlaces เปลี่ยนแปลง
  useEffect(() => {
    const total = checkedPlaces.reduce((sum, place) => sum + (place?.price || 0), 0);
    setTotalPrice(total);
  }, [checkedPlaces]);

  // ฟังก์ชันสำหรับจัดการการเลือกหรือยกเลิกสถานที่
  const handleCheckboxChange = (place, checked) => {
    if (checked) {
      setCheckedPlaces([...checkedPlaces, place]);
    } else {
      setCheckedPlaces(checkedPlaces.filter((p) => p.locationId !== place.locationId));
    }
  };

  const handleConfirm = async () => {
    const locationIds = checkedPlaces.map((place) => place.locationId);
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
    setCheckedPlaces((prevChecked) =>
      prevChecked.filter((place) => place.locationId !== id)
    );
  };

  return (
    <Drawer
      title={t("added_places")}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={500}
      className="font-kanit"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose} className="mr-2 font-kanit">
            {t("close")}
          </Button>
          {checkedPlaces.length > 0 && (
            <Button type="primary" className="font-kanit" onClick={handleConfirm}>
              {t("confirm")}
            </Button>
          )}
        </div>
      }
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {selectedPlaces.length > 0 ? (
          selectedPlaces.map((place) => (
            <AnimatePresence key={place.locationId}>
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <Checkbox
                  onChange={(e) => handleCheckboxChange(place, e.target.checked)}
                  checked={checkedPlaces.some((p) => p.locationId === place.locationId)}
                  className="custom-checkbox"
                />
                <div className="flex items-center flex-1 ml-4">
                  <img
                    src={place.locationImg[0].url}
                    alt={place.name}
                    className="w-24 h-24 object-cover rounded-md mr-3"
                  />
                  <span className="text-gray-800">{place.name}</span>
                </div>
                <Button
                  type="text"
                  danger
                  onClick={() => handleRemove(place.locationId)}
                  className="text-red-500 hover:text-red-600 text-3xl"
                >
                  <FaTrash className="text-lg" />
                </Button>
              </motion.div>
            </AnimatePresence>
          ))
        ) : (
          <p className="text-gray-500">{t("no_added_places")}</p>
        )}
      </div>

      {/* แสดงราคารวม */}
      {checkedPlaces.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-bold">{t("total_price")}</h3>
          <p className="text-xl text-green-600">฿{totalPrice.toLocaleString()}</p>
        </div>
      )}
    </Drawer>
  );
};

export default AddedPlacesModal;