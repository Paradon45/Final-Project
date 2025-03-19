import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Drawer, Button, message, Tooltip, Select, List, Avatar } from "antd"; // นำเข้า Select, List, Avatar จาก Ant Design
import { FaTrash } from "react-icons/fa";

const { Option } = Select;

const AddedBudgetModal = ({ isOpen, onClose, travelCost }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [plan, setPlan] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPlanValid, setIsPlanValid] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // เพิ่ม state สำหรับเลือกวัน
  const [dailyBudgets, setDailyBudgets] = useState({}); // เพิ่ม state สำหรับเก็บค่าใช้จ่ายของแต่ละวัน

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
      const total = planData.planDays.reduce((sum, day) => {
        return (
          sum +
          day.locations.reduce((daySum, loc) => daySum + (loc.location?.price || 0), 0)
        );
      }, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  // คำนวณค่าใช้จ่ายของแต่ละวัน (รวมค่าเดินทาง)
  const calculateDailyBudget = (day) => {
    const travelCostValue = parseFloat(travelCost) || 0; // แปลงค่าเดินทางเป็นตัวเลข
    const dayLocations = plan?.planDays?.find((d) => d.day === day)?.locations || [];
    const dayTotal = dayLocations.reduce((sum, loc) => sum + (loc.location?.price || 0), 0);
    return dayTotal + travelCostValue; // รวมค่าเดินทาง
  };

  // ฟังก์ชันบันทึกค่าใช้จ่ายของแต่ละวัน
  const handleSaveDailyBudget = () => {
    if (!selectedDay) {
      message.error("กรุณาเลือกวันที่ก่อน");
      return;
    }

    const dailyBudget = calculateDailyBudget(selectedDay); // คำนวณค่าใช้จ่ายของวันที่เลือก
    setDailyBudgets((prev) => ({
      ...prev,
      [selectedDay]: dailyBudget, // บันทึกค่าใช้จ่ายของวันที่เลือก
    }));
    message.success(`บันทึกค่าใช้จ่ายสำหรับวันที่ ${selectedDay} สำเร็จ`);
  };

  // ฟังก์ชันลบค่าใช้จ่ายของแต่ละวัน
  const handleRemoveDailyBudget = (day) => {
    setDailyBudgets((prev) => {
      const updatedBudgets = { ...prev };
      delete updatedBudgets[day]; // ลบค่าใช้จ่ายของวันที่เลือก
      return updatedBudgets;
    });
    message.success(`ลบค่าใช้จ่ายสำหรับวันที่ ${day} สำเร็จ`);
  };

  // ฟังก์ชันรวมค่าใช้จ่ายทั้งหมด (รวมค่าเดินทาง)
  const calculateTotalDailyBudgets = () => {
    return Object.values(dailyBudgets).reduce((sum, budget) => sum + budget, 0);
  };

  // ฟังก์ชันอัพเดตค่า budget กลับไปยัง API
  const updateBudget = async () => {
    const totalBudget = calculateTotalDailyBudgets(); // รวมค่าใช้จ่ายของทุกวัน
    const selectedPlanId = localStorage.getItem("selectedPlanId");
    if (!selectedPlanId) {
      console.error("Plan ID not found");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ดึง Token จาก localStorage
      const response = await fetch(`${API_URL}/plan/${selectedPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // เพิ่ม Token ใน Header
        },
        body: JSON.stringify({
          budget: parseFloat(totalBudget), // แปลงค่า budget เป็นตัวเลข
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update budget");
      }

      const data = await response.json();
      console.log("Budget updated successfully:", data);
      message.success("บันทึกค่าใช้จ่ายทั้งหมดสำเร็จ");
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
            {/* เลือกวัน */}
            <div className="mb-4">
              <Select
                placeholder={t("select_day")}
                onChange={(value) => setSelectedDay(value)}
                className="w-full font-kanit"
              >
                {plan?.planDays?.map((day) => (
                  <Option key={day.id} value={day.day} className="font-kanit">
                    {t("day")} {day.day}
                  </Option>
                ))}
              </Select>
            </div>

            {/* ปุ่มบันทึกค่าใช้จ่ายของแต่ละวัน */}
            {selectedDay && (
              <Button
                type="primary"
                className="font-kanit mb-4"
                onClick={handleSaveDailyBudget}
              >
                บันทึกค่าใช้จ่ายสำหรับวันที่ {selectedDay}
              </Button>
            )}

            {/* แสดงรายละเอียดของสถานที่ในแต่ละวัน */}
            {selectedDay && (
              <List
                itemLayout="horizontal"
                dataSource={plan?.planDays?.find((d) => d.day === selectedDay)?.locations || []}
                renderItem={(location) => (
                  <List.Item>
                    <List.Item.Meta
                      className="font-kanit"
                      avatar={<Avatar src={location.location?.locationImg[0].url} />}
                      title={location.location?.name}
                      description={`฿${location.location?.price.toLocaleString()}`}
                    />
                  </List.Item>
                )}
              />
            )}

            {/* แสดงค่าใช้จ่ายของแต่ละวัน (รวมค่าเดินทาง) */}
            {Object.entries(dailyBudgets).map(([day, budget]) => (
              <div key={day} className="flex justify-between items-center mb-4">
                <span className="text-gray-800">
                  ค่าใช้จ่ายวันที่ {day}: ฿{budget.toLocaleString()} (รวมค่าเดินทาง)
                </span>
                <Button
                  type="text"
                  danger
                  onClick={() => handleRemoveDailyBudget(day)}
                >
                  <FaTrash className="text-lg" />
                </Button>
              </div>
            ))}

            {/* แสดงผลรวมค่าใช้จ่ายทั้งหมด (รวมค่าเดินทาง) */}
            {Object.keys(dailyBudgets).length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold">{t("total_budget")}</h3>
                <p className="text-xl text-purple-600">
                  ฿{calculateTotalDailyBudgets().toLocaleString()} (รวมค่าเดินทาง)
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