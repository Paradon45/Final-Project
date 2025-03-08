import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // นำเข้า Link จาก react-router-dom
import "chart.js/auto";

const Profile = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const userIdString = localStorage.getItem("userID");
  const userId = userIdString ? parseInt(userIdString, 10) : null;
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPlans = async () => {
      if (!userId || !token) {
        setError("User ID or token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch plans data");
        }
        const data = await response.json();
        setPlans(data.plan || []); // ตั้งค่า plans เป็นอาร์เรย์ว่างหากไม่มีข้อมูล
        if (data.plan && data.plan.length > 0) {
          setSelectedPlan(data.plan[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userId, token, API_URL]);

  if (loading) {
    return <p className="text-center text-xl font-bold">{t("loading")}</p>;
  }

  if (error) {
    return (
      <p className="text-center text-xl font-bold text-red-500">
        {t("error_loading_data")}: {error}
      </p>
    );
  }

  // กรณีไม่มีแผนการเที่ยว
  if (plans.length === 0) {
    return (
      <div className="animate-fadeIn min-h-screen bg-gradient-to-b from-gray-200 to-white py-12 px-4 font-kanit">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {t("no_plans_found")}
          </h2>
          <p className="text-gray-600 mb-6">
            กรุณาสร้างแพลนเที่ยวอย่างน้อย 1 ครั้ง เพื่อสร้างโปรไฟล์
          </p>
          <Link
            to="/recommend"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            ไปยังหน้าแนะนำที่เที่ยว
          </Link>
        </div>
      </div>
    );
  }

  const user = plans[0].user;

  return (
    <div className="animate-fadeIn min-h-screen bg-gradient-to-b from-gray-200 to-white py-12 px-4 font-kanit">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <img
            src={`https://i.pravatar.cc/150?u=${user.userId}`}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-300 shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t("travel_plans")}
        </h2>

        {/* Dropdown สำหรับเลือกแผน */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            {t("select_plan")}
          </label>
          <select
            onChange={(e) => {
              const selected = plans.find(
                (plan) => plan.planId === parseInt(e.target.value, 10)
              );
              setSelectedPlan(selected);
            }}
            className="p-3 border rounded-lg w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {plans.map((plan, index) => (
              <option key={plan.planId} value={plan.planId}>
                {plan.name} (แผนการเดินทาง #{index + 1})
              </option>
            ))}
          </select>
        </div>

        {/* ข้อมูลแผนที่เลือก */}
        {selectedPlan && (
          <div className="animate-fadeIn mb-8 p-6 bg-blue-50 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600 mb-2">
              {t("planname")} : {selectedPlan.name} (แผนการเดินทาง #
              {plans.findIndex((plan) => plan.planId === selectedPlan.planId) + 1})
            </h3>
            <div className="text-lg text-gray-600 space-y-2">
              <p>
                <strong>{t("budget")} :</strong>{" "}
                {selectedPlan.budget ? `฿${selectedPlan.budget.toLocaleString()}` : "N/A"}
              </p>
              <p>
                <strong>{t("days")} :</strong> {selectedPlan.day}
              </p>
            </div>

            <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
              {t("locations")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedPlan.plan_location.map((location) => (
                <div
                  key={location.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <h5 className="text-lg font-bold text-gray-800">
                    {location.location.name}
                  </h5>
                  <p className="text-gray-600">
                    <strong>{t("category")} :</strong> {location.location.category.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>{t("price")} :</strong> ฿{location.location.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>{t("description")} :</strong> {location.location.description}
                  </p>
                  <img
                    src={location.location.locationImg[0].url}
                    alt={location.location.name}
                    className="w-full h-48 object-cover mt-2 rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;