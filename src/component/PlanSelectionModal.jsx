import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToast } from "../component/ToastComponent"; // นำเข้า useToast หากต้องการแสดง Toast

const PlanSelectionModal = ({ isOpen, onClose, userId, onSelectPlan }) => {
  const { t } = useTranslation();
  const { ToastComponent, showToast } = useToast();
  const [plans, setPlans] = useState([]);
  const [creatingNewPlan, setCreatingNewPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanStartDate, setNewPlanStartDate] = useState("");
  const [newPlanEndDate, setNewPlanEndDate] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null); // ID ของแผนที่กำลังแก้ไข
  const [editPlanName, setEditPlanName] = useState(""); // ชื่อแผนที่กำลังแก้ไข
  const [editPlanStartDate, setEditPlanStartDate] = useState(""); // วันที่เริ่มต้นที่กำลังแก้ไข
  const [editPlanEndDate, setEditPlanEndDate] = useState(""); // วันที่สิ้นสุดที่กำลังแก้ไข
  const API_URL = import.meta.env.VITE_API_URL;

  // ดึงข้อมูลแผนการเดินทาง
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
      showToast(t("fetch_error"));
    }
  };

  // ดึงข้อมูลแผนการเดินทางเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserPlans();
    }
  }, [isOpen, userId]);

  // สร้างแผนการเดินทางใหม่
  const createNewPlan = async () => {
    if (!newPlanName.trim() || !newPlanStartDate || !newPlanEndDate) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/plan/createPlan/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newPlanName,
          startDate: newPlanStartDate,
          endDate: newPlanEndDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPlans([...plans, data]);
      setCreatingNewPlan(false);
      setNewPlanName("");
      setNewPlanStartDate("");
      setNewPlanEndDate("");
      window.location.reload();
    } catch (error) {
      console.error("Error creating plan:", error);
      showToast(t("unknown_error"));
    }
  };

  // ลบแผนการเดินทาง
  const deletePlan = async (planId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/plan/${planId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPlans((prevPlans) =>
        prevPlans.filter((plan) => plan.planId !== planId)
      );
    } catch (error) {
      console.error("Error deleting plan:", error);
      showToast(t("unknown_error"));
    }
  };

  // อัพเดตแผนการเดินทาง
  const updatePlan = async (planId) => {
    if (!editPlanName.trim() || !editPlanStartDate || !editPlanEndDate) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/plan/${planId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editPlanName,
          startDate: editPlanStartDate,
          endDate: editPlanEndDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedPlan = await response.json();
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.planId === planId ? updatedPlan : plan))
      );
      setEditingPlanId(null); // ปิดโหมดแก้ไข
      showToast(t("plan_updated_successfully"));
      window.location.reload();
    } catch (error) {
      console.error("Error updating plan:", error);
      showToast(t("unknown_error"));
    }
  };

  // เริ่มโหมดแก้ไขแผน
  const startEditingPlan = (plan) => {
    setEditingPlanId(plan.planId);
    setEditPlanName(plan.name);
    setEditPlanStartDate(plan.startDate.substring(0, 10));
    setEditPlanEndDate(plan.endDate.substring(0, 10));
  };

  return (
    <div>
      {ToastComponent}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center"
        >
          <div className="animate-fadeIn bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {t("select_travel_plan")}
            </h2>

            {plans.length > 0 && !creatingNewPlan && !editingPlanId ? (
              <div className="max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.planId}
                      initial={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between space-x-2"
                    >
                      <button
                        className="flex-1 bg-blue-500 text-white p-2 rounded text-left whitespace-normal break-words hover:bg-blue-600 duration-200"
                        onClick={() => onSelectPlan(plan.planId)}
                      >
                        <div className="flex  items-center justify-center space-x-2">
                          <div className="text-lg">{plan.name}</div>
                          <button
                            className="text-yellow-500 hover:text-yellow-600 duration-200"
                            onClick={(e) => {
                              e.stopPropagation(); // ป้องกันการคลิกปุ่มหลัก
                              startEditingPlan(plan);
                            }}
                          >
                            <FaEdit className="text-lg" />
                          </button>
                        </div>
                        <div className="text-sm text-center">
                          {t("days")} : {plan.startDate.substring(0, 10)} -{" "}
                          {plan.endDate.substring(0, 10)}
                        </div>
                      </button>

                      <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 duration-200 flex items-center justify-center"
                        onClick={() => deletePlan(plan.planId)}
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2 flex items-center justify-center"
                  onClick={() => setCreatingNewPlan(true)}
                >
                  <FaPlus className="mr-2" /> {t("add_new_plan")}
                </button>
              </div>
            ) : editingPlanId ? (
              <div className="animate-fadeIn">
                <p className="mb-2">{t("planname")}</p>
                <input
                  type="text"
                  className="border p-2 w-full mb-2"
                  placeholder={t("plan_name_placeholder")}
                  value={editPlanName}
                  onChange={(e) => setEditPlanName(e.target.value)}
                />
                <p className="mb-2">{t("start_date")}</p>
                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={editPlanStartDate}
                  onChange={(e) => setEditPlanStartDate(e.target.value)}
                />
                <p className="mb-2">{t("end_date")}</p>
                <input
                  type="date"
                  className="border p-2 w-full mb-2"
                  value={editPlanEndDate}
                  onChange={(e) => setEditPlanEndDate(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={() => updatePlan(editingPlanId)}
                >
                  {t("update_plan")}
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded w-full mt-2"
                  onClick={() => setEditingPlanId(null)}
                >
                  {t("back")}
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <p className="mb-2">{t("planname")}</p>
                <input
                  type="text"
                  required
                  className="border p-2 w-full mb-2"
                  placeholder={t("plan_name_placeholder")}
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                />
                <p className="mb-2">{t("start_date")}</p>
                <input
                  type="date"
                  required
                  className="border p-2 w-full mb-2"
                  value={newPlanStartDate}
                  onChange={(e) => setNewPlanStartDate(e.target.value)}
                />
                <p className="mb-2">{t("end_date")}</p>
                <input
                  type="date"
                  required
                  className="border p-2 w-full mb-2"
                  value={newPlanEndDate}
                  onChange={(e) => setNewPlanEndDate(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full"
                  onClick={createNewPlan}
                >
                  {t("create_new_plan")}
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded w-full mt-2"
                  onClick={() => setCreatingNewPlan(false)}
                >
                  {t("back")}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default PlanSelectionModal;