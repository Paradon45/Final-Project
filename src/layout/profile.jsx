import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import person from "../photo/image__1_-removebg-preview.png"

const Profile = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    profileImage: person,
    travelHistory: [
      { id: 1, place: "Bangkok", date: "2024-01-15", cost: 5000 },
      { id: 2, place: "Chiang Mai", date: "2023-12-05", cost: 8000 },
      { id: 3, place: "Phuket", date: "2023-11-20", cost: 12000 },
    ],
  };

  const chartData = {
    labels: user.travelHistory.map((trip) => trip.place),
    datasets: [
      {
        label: t("cost"),
        data: user.travelHistory.map((trip) => trip.cost),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="md:p-14">
      <div className="bg-gray-100 min-h-screen py-12 px-4 font-kanit">
        <div className="animate-fadeIn max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-25 rounded-full border-4 border-gray-300"
            />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              {user.name}
            </h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <h2 className="animate-fadeIn2Delay1 text-2xl font-semibold text-gray-700 mb-4">
            {t("travel_history")}
          </h2>
          <div className="animate-fadeInDelay1 overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left">{t("attractions")}</th>
                  <th className="px-6 py-3 text-left">{t("date")}</th>
                  <th className="px-6 py-3 text-left">{t("cost")}</th>
                </tr>
              </thead>
              <tbody>
                {user.travelHistory.map((trip) => (
                  <tr key={trip.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{trip.place}</td>
                    <td className="px-6 py-3">{trip.date}</td>
                    <td className="px-6 py-3">
                      {trip.cost.toLocaleString()} ฿
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="animate-fadeInDelay2 text-2xl font-semibold text-gray-700 mb-4">
            {t("spending_chart")}
          </h2>
          <div className="animate-fadeInDelay2 bg-gray-50 p-4 rounded-md shadow">
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
