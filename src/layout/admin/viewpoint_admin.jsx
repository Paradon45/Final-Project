import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ViewPointPageAdmin = () => {
  const { locationId } = useParams();
  const [location, setLocation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { t } = useTranslation();
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newImages, setNewImages] = useState([]); // State สำหรับเก็บรูปภาพใหม่
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/location/${locationId}`);
        if (!response.ok) throw new Error("Failed to fetch location details.");

        const data = await response.json();
        setLocation(data.location);
        setFormData({
          name: data.location.name || "",
          description: data.location.description || "",
          map: data.location.map || "",
          address: data.location.address || "",
          phone: data.location.phone || "",
          date: data.location.date || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
    window.scrollTo(0, 0);
  }, [locationId]);

  const handleNextImage = () => {
    if (location?.locationImg?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % location.locationImg.length);
    }
  };

  const handlePrevImage = () => {
    if (location?.locationImg?.length > 1) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + location.locationImg.length) % location.locationImg.length
      );
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]); // เก็บไฟล์รูปภาพที่ผู้ใช้เลือก
  };

  const handleUpdate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // เพิ่มข้อมูลฟอร์มลงใน FormData
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // เพิ่มรูปภาพใหม่ลงใน FormData
      newImages.forEach((image) => {
        formDataToSend.append("Images", image); // ใช้ "Images" เพื่อให้ตรงกับ API
      });

      const response = await fetch(`${API_URL}/admin/location/${locationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // ส่ง FormData แทน JSON
      });

      if (!response.ok) throw new Error("Failed to update location.");

      const updatedData = await response.json();
      setLocation(updatedData.location);
      setEditMode(false);
      setNewImages([]); // ล้างรูปภาพใหม่หลังจากอัปเดตเสร็จ
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white font-kanit min-h-screen p-16">
      {/* Loading/Success Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            {isSuccess ? (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-green-600">
                  อัปเดตสำเร็จ!
                </h1>
                <div className="text-green-600 text-6xl">✔</div>
              </div>
            ) : error ? (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                  อัปเดตไม่สำเร็จ!
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

      {/* Header */}
      <header className="animate-fadeInDelay2 text-center mb-8 mt-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {location.name}
        </h1>
        <div className="w-20 h-1 bg-yellow-500 mx-auto"></div>
        <div className="text-left mt-4">
          <Link to={`/landingadmin`}>
            <div className="text-left mt-4">
              <button className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200">
                {t("back")}
              </button>
            </div>
          </Link>
        </div>
      </header>

      {/* Content Section */}
      <div className="container mx-auto px-6 lg:px-5">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 bg-white shadow-lg rounded-lg overflow-hidden p-6">
          {/* Image Section */}
          <div className="animate-fadeIn2Delay2 flex-1 mb-6 md:mb-0 relative">
            {location?.locationImg?.length > 0 && (
              <>
                <img
                  src={location.locationImg[currentImageIndex]?.url}
                  alt={`วิว ${location.name} ${currentImageIndex + 1}`}
                  className="rounded-lg shadow-md w-full object-cover h-96"
                />
                {location.locationImg.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
                    >
                      {"<"}
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-500"
                    >
                      {">"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="animate-fadeInDelay2 flex-1 text-gray-700">
            {editMode ? (
              <div>
                <label className="block font-bold mb-2">{t("name")}</label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("ph_name")}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block font-bold mt-4 mb-2">
                  {t("description")}
                </label>
                <textarea
                  name="description"
                  placeholder={t("ph_description")}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                />

                <label className="block font-bold mt-4 mb-2">
                  {t("category")}
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">{t("ph_category")}</option>
                  <option value="1">{t("nature")}</option>
                  <option value="2">{t("temples")}</option>
                  <option value="3">{t("markets")}</option>
                  <option value="5">{t("cafepage")}</option>
                  <option value="6">{t("staypage")}</option>
                  <option value="4">{t("others")}</option>
                </select>

                <label className="block font-bold mt-4 mb-2">
                  {t("googlemap")}
                </label>
                <input
                  type="text"
                  name="map"
                  placeholder={t("ph_googlemap")}
                  value={formData.map}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block font-bold mt-4 mb-2">
                  {t("location")}
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder={t("ph_location")}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block font-bold mt-4 mb-2">
                  {t("phone")}
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder={t("ph_phone")}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label className="block font-bold mt-4 mb-2">
                  {t("open-close")}
                </label>
                <input
                  type="text"
                  name="date"
                  placeholder={t("ph_open-close")}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                {/* Input สำหรับอัปโหลดรูปภาพใหม่ */}
                <label className="block font-bold mt-4 mb-2">
                  {t("photo")}
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <button
                  onClick={handleUpdate}
                  className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow"
                >
                  {t("update")}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="mt-4 ml-2 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded shadow"
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-xl mb-4 text-yellow-600">
                  {location.name}
                </p>
                <p className="text-base leading-7 mb-4">
                  {location.description}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow"
                >
                  {t("edit_location")}
                </button>
              </div>
            )}

            {/* Google Map */}
            {location.map && (
              <div className="rounded-lg overflow-hidden shadow-md mt-6">
                <iframe
                  src={location.map}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPointPageAdmin;