import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Drawer, Button, message, Tooltip } from "antd"; // นำเข้า Tooltip จาก Ant Design
import { FaTrash } from "react-icons/fa";

const AddedBudgetModal = ({ isOpen, onClose, travelCost }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [plan, setPlan] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPlanValid, setIsPlanValid] = useState(true); // เพิ่ม state สำหรับตรวจสอบความถูกต้องของแผน

  // ดึง userId จาก localStorage
  const userIdString = localStorage.getItem("userID");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  useEffect(() => {
    if (isOpen) {
      fetchPlan();
    }
  }, [isOpen]);

  // ดึงข้อมูลแผนการเดินทางจาก API
  const fetchPlan = async () => {
    const selectedPlanId = localStorage.getItem("selectedPlanId");
    if (!selectedPlanId) {
      console.error("Plan ID not found");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
      const response = await fetch(`${API_URL}/plan/${selectedPlanId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // เพิ่ม Token ใน Header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plan");
      }

      const data = await response.json();
      const planData = data.plan;

      // ตรวจสอบว่า plan.userId ตรงกับ userId ของผู้ใช้หรือไม่
      if (planData.userId !== userId) {
        setIsPlanValid(false); // แผนไม่ถูกต้อง
        return;
      }

      setIsPlanValid(true); // แผนถูกต้อง
      setPlan(planData);

      // คำนวณราคารวมของสถานที่
      const total = planData.plan_location.reduce(
        (sum, pl) => sum + (pl.location?.price || 0),
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  // คำนวณราคาทั้งหมด (รวมราคาสถานที่และค่าเดินทาง)
  const calculateTotalBudget = () => {
    const travelCostValue = parseFloat(travelCost) || 0; // แปลงค่าเดินทางเป็นตัวเลข
    return totalPrice + travelCostValue;
  };

  // ฟังก์ชันอัพเดตค่า budget กลับไปยัง API
  const updateBudget = async () => {
    const selectedPlanId = localStorage.getItem("selectedPlanId");
    if (!selectedPlanId) {
      console.error("Plan ID not found");
      return;
    }

    const totalBudget = calculateTotalBudget(); // คำนวณราคาทั้งหมด

    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
      const response = await fetch(`${API_URL}/plan/${selectedPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // เพิ่ม Token ใน Header
        },
        body: JSON.stringify({
          budget: totalBudget, // ส่งราคาทั้งหมดไปยัง API
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update budget");
      }

      const data = await response.json();
      console.log("Budget updated successfully:", data);
      message.success("บันทึกค่าใช้จ่ายสำเร็จ");
    } catch (error) {
      console.error("Error updating budget:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย");
    }
  };

  return (
    <Drawer
      title={t("added_budget")}
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
          {/* ปุ่มอัพเดต budget */}
          {travelCost === null ? (
            <Tooltip className="font-kanit" title="กรุณาค้นหาเส้นทางเพื่อคำนวณค่าเดินทางก่อน">
              <Button
                type="primary"
                className="font-kanit"
                disabled // ปุ่มไม่สามารถกดได้
              >
                {t("update_budget")}
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="primary"
              className="font-kanit"
              onClick={updateBudget} // เพิ่มปุ่มอัพเดต budget
            >
              {t("update_budget")}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* ตรวจสอบว่าแผนถูกต้องหรือไม่ */}
        {!isPlanValid ? (
          <div className="text-center mt-10">
            <p className="text-xl text-gray-700">
              คุณไม่มีสิทธิ์เข้าถึงแผนการเดินทางนี้
            </p>
          </div>
        ) : (
          <>
            {/* รายการสถานที่ */}
            <div className="flex-1 overflow-y-auto">
              {plan?.plan_location?.length > 0 ? (
                plan.plan_location.map((pl) => (
                  <AnimatePresence key={pl.location.locationId}>
                    <motion.div
                      className="flex items-center mb-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center flex-1">
                        <img
                          src={pl.location.locationImg[0]?.url || ""}
                          alt={pl.location.name}
                          className="w-24 h-24 object-cover rounded-md mr-3"
                        />
                        <div>
                          <span className="text-gray-800">{pl.location.name}</span>
                          <p className="text-gray-600">
                            ฿{pl.location.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))
              ) : (
                <p className="text-gray-500">{t("no_added_places")}</p>
              )}
            </div>

            {/* แสดงราคารวมของสถานที่ */}
            {plan?.plan_location?.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold">{t("total_price")}</h3>
                <p className="text-xl text-green-600">฿{totalPrice.toLocaleString()}</p>
              </div>
            )}

            {/* แสดงค่าเดินทาง */}
            {travelCost !== null && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold">{t("travel_cost")}</h3>
                <p className="text-xl text-blue-600">฿{travelCost}</p>
              </div>
            )}

            {/* แสดงราคาทั้งหมด (รวมราคาสถานที่และค่าเดินทาง) */}
            {travelCost !== null && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold">{t("total_budget")}</h3>
                <p className="text-xl text-purple-600">
                  ฿{calculateTotalBudget().toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default AddedBudgetModal;