import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Profile = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null); // State สำหรับเก็บแผนที่เลือก

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
        setPlans(data.plan); // เก็บข้อมูลแผนการเดินทางใน state
        if (data.plan.length > 0) {
          setSelectedPlan(data.plan[0]); // เลือกแผนแรกเป็นค่าเริ่มต้น
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

  if (plans.length === 0) {
    return <p className="text-center text-xl font-bold">{t("no_plans_found")}</p>;
  }

  // ดึงข้อมูลผู้ใช้จากแผนการเดินทางตัวแรก
  const user = plans[0].user;

  return (
    <div className="md:p-14">
      <div className="bg-gray-100 min-h-screen py-12 px-4 font-kanit">
        <div className="animate-fadeIn max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <img
              src={`https://i.pravatar.cc/150?u=${user.userId}`} // ใช้รูปโปรไฟล์เริ่มต้น
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-300"
            />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {t("travel_plans")}
          </h2>

          {/* Dropdown สำหรับเลือกแผนการเดินทาง */}
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
              className="p-2 border rounded w-full"
            >
              {plans.map((plan, index) => (
                <option key={plan.planId} value={plan.planId}>
                  {plan.name} (แผนการเดินทาง #{index + 1})
                </option>
              ))}
            </select>
          </div>

          {/* แสดงข้อมูลแผนการเดินทางที่เลือก */}
          {selectedPlan && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-green-600 mb-2">
                {t("planname")} : {selectedPlan.name} (แผนการเดินทาง #
                {plans.findIndex((plan) => plan.planId === selectedPlan.planId) + 1})
              </h3>
              <p className="text-lg text-gray-600">
                <strong>{t("budget")} :</strong>{" "}
                {selectedPlan.budget ? `฿${selectedPlan.budget.toLocaleString()}` : "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <strong>{t("days")} :</strong> {selectedPlan.day}
              </p>

              <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                {t("locations")}
              </h4>
              <div className="space-y-4">
                {selectedPlan.plan_location.map((location) => (
                  <div
                    key={location.id}
                    className="bg-gray-50 p-4 rounded-md shadow"
                  >
                    <h5 className="text-lg font-bold text-gray-800">
                      {location.location.name}
                    </h5>
                    <p className="text-gray-600">
                      <strong>{t("category")} :</strong>{" "}
                      {location.location.category.name}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t("price")} :</strong>{" "}
                      ฿{location.location.price.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>{t("description")} :</strong>{" "}
                      {location.location.description}
                    </p>
                    <img
                      src={location.location.locationImg[0].url}
                      alt={location.location.name}
                      className="w-full h-48 object-cover mt-2 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;