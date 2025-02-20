import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useToast } from "../../component/ToastComponent";

const AddLocationPageAdmin = () => {
  const navigate = useNavigate();
  const { ToastComponent, showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    map: "",
    address: "",
    phone: "",
    date: "",
    Images: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "categoryId" ? Number(value) : value,
    }));
  };

  const hdlImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setFormData((prev) => ({ ...prev, Images: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "Images") {
          value.forEach((file) => data.append("Images", file));
        } else {
          data.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}/admin/location`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorMessage =
          response.status === 500
            ? "เกิดข้อผิดพลาดในระบบ"
            : "เพิ่มสถานที่ไม่สำเร็จ";
        setError(errorMessage);
        showToast("เพิ่มสถานที่ไม่สำเร็จ");
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
      navigate(`/landingadmin`);
      
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn2 font-kanit bg-gradient-to-b from-gray-200 to-gray-100 container mx-auto p-8 mt-12 md:p-16">
      {ToastComponent}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            {isSuccess ? (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-green-600">
                  เพิ่มสำเร็จ!
                </h1>
                <div className="text-green-600 text-6xl">✔</div>
              </div>
            ) : error ? (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                  เพิ่มสถานที่ไม่สำเร็จ!
                </h1>
                <div className="text-red-600 text-6xl">✖</div>
                <p className="text-gray-700 mt-2">{error}</p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-center">
                  {t("loading")}
                </h1>
                <div className="loader w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-5 flex justify-center items-center">
        {t("addpage")}
        <FaPlus className="text-orange-500 text-3xl ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
      </h1>
      <div className="w-20 h-1 bg-orange-500 mx-auto mb-4"></div>
      <Link to={`/landingadmin`}>
        <div className="text-right mt-4">
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg shadow transition duration-200">
            {t("goto_up/del")}
          </button>
        </div>
      </Link>
      {error && (
        <div className="font-semibold text-xl text-red-500 mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("name")}</label>
          <input
            type="text"
            name="name"
            placeholder={t("ph_name")}
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("description")}</label>
          <textarea
            name="description"
            placeholder={t("ph_description")}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("category")}</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
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

        {/* Map */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("googlemap")}</label>
          <input
            type="text"
            name="map"
            placeholder={t("ph_googlemap")}
            value={formData.map}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("location")}</label>
          <input
            type="text"
            name="address"
            placeholder={t("ph_location")}
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("phone")}</label>
          <input
            type="text"
            name="phone"
            placeholder={t("ph_phone")}
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("open-close")}</label>
          <input
            type="text"
            name="date"
            placeholder={t("ph_open-close")}
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-4 py-2"
            required
          />
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">{t("photo")}</label>
          <input
            type="file"
            multiple
            accept="image/jpeg"
            onChange={hdlImageChange}
            className="w-full border px-4 py-2"
          />
          <div className="flex flex-wrap mt-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 text-white font-bold rounded-lg ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("addpage")}
        </button>
      </form>
    </div>
  );
};

export default AddLocationPageAdmin;
