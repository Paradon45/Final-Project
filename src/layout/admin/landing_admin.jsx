import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LandingAdmin = () => {
  const { categoryId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteState, setDeleteState] = useState({
    isLoading: false,
    isSuccess: false,
    error: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;


  const categories = [
    { id: "", name: t("all_locations") },
    { id: "1", name: t("nature") },
    { id: "2", name: t("temples") },
    { id: "3", name: t("markets") },
    { id: "4", name: t("cafepage") },
    { id: "5", name: t("staypage") },
    { id: "6", name: t("others") },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/location/landing`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations data.");
        }
        const data = await response.json();
        setLocations(data.locations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const filterByCategory = () => {
      const filtered = locations.filter((location) => {
        const matchesCategory = categoryId
          ? location.categoryId.toString() === categoryId
          : true;
        const matchesSearch = location.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      setFilteredLocations(filtered);
    };

    filterByCategory();
  }, [locations, categoryId, searchQuery]);

  const handleDelete = async () => {
    setDeleteState({ isLoading: true, isSuccess: false, error: null });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/admin/location/${deleteLocationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete location.");
      }

      // Remove the deleted location from state
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.locationId !== deleteLocationId)
      );

      setDeleteState({ isLoading: false, isSuccess: true, error: null });
    } catch (err) {
      setDeleteState({
        isLoading: false,
        isSuccess: false,
        error: err.message,
      });
    } finally {
      setShowConfirmModal(false);
    }
  };

  const openConfirmModal = (locationId) => {
    setDeleteLocationId(locationId);
    setShowConfirmModal(true);
  };

  useEffect(() => {
    if (deleteState.isSuccess || deleteState.error) {
      const timer = setTimeout(() => {
        setDeleteState({ isLoading: false, isSuccess: false, error: null });
      }, 2000); 
  
      return () => clearTimeout(timer); 
    }
  }, [deleteState.isSuccess, deleteState.error]);

  return (
    <div className="font-kanit bg-gradient-to-b from-gray-200 to-gray-100 animate-fadeIn max-w-7xl mx-auto p-8 md:p-16">
      {/* Header */}
      <header className="text-center mb-4 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex justify-center items-center">
            {t("locations")}
          </h1>
          <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
        </div>
        <Link to={`/homeadmin`}>
          <div className="text-left mt-4">
            <button className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200">
              {t("back")}
            </button>
          </div>
        </Link>

        <Link to={`/addlocationadmin`}>
                <div className="text-right">
                  <button className="px-6 py-2 bg-green-500 hover:bg-green-600 font-semibold text-white rounded-lg shadow transition duration-200">
                    {t("goto_add")}
                  </button>
                </div>
              </Link>
      </header>

      {/* Filters */}
      <nav className="flex justify-center mb-6 space-x-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/landingadmin/${category.id || ""}`)}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200 ${
              categoryId === category.id
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("ph_search")}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring focus:ring-orange-300"
        />
      </div>

      {/* Main Section */}
      <section className="bg-white py-12 rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center">{t("loading")}</p>}
          {error && (
            <p className="text-center text-red-500">
              {t("error_loading_data")}
            </p>
          )}
          {!loading && !error && (
            <>
              {filteredLocations.length === 0 ? (
                <p className="text-center text-gray-500">
                  {t("no_locations_in_category")}
                </p>
              ) : (
                <div className="overflow-y-auto max-h-[500px] space-y-6 p-7 border border-gray-200 rounded-lg shadow-inner">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.locationId}
                      className="mb-4 flex items-center bg-gray-100 rounded-lg shadow-md p-4 hover:shadow-lg transform transition duration-200 hover:scale-105"
                    >
                      <img
                        src={location.locationImg[0]?.url || "/placeholder.jpg"}
                        alt={location.name}
                        className="w-32 h-32 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-grow">
                        <div className="text-xl font-bold text-red-600">
                          {location.name}
                        </div>
                        <p className="text-gray-600 mt-2 mr-2 line-clamp-2">
                          {location.description}
                        </p>
                      </div>
                      <Link to={`/viewpointadmin/${location.locationId}`}>
                      <button
                        className="px-4 py-2 mr-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
                      >
                        {t("edit_location")}
                      </button>
                      </Link>
                      <button
                        onClick={() => openConfirmModal(location.locationId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">{t("confirm_delete")}</h1>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                {t("confirm")}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete State Modal */}
      {(deleteState.isLoading || deleteState.isSuccess || deleteState.error) && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            {deleteState.isLoading && (
              <div>
                <h1 className="text-2xl font-bold mb-4">{t("deleting")}</h1>
                <div className="loader w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
            {deleteState.isSuccess && (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-green-600">
                  {t("delete_success")}
                </h1>
                <div className="text-green-600 text-6xl">✔</div>
              </div>
            )}
            {deleteState.error && (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-red-600">
                  {t("delete_failed")}
                </h1>
                <div className="text-red-600 text-6xl">✖</div>
                <p className="text-gray-700 mt-2">{deleteState.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingAdmin;
