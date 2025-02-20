import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = ({ isOpen, onClose, openRegister, setUserID }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setError(null);
    setSuccessMessage(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(false);

    try {
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) {
        if (loginResponse.status === 401) {
          setError(t("login_failed"));
          setHasError(true);
          setTimeout(() => setHasError(false), 500);
        } else {
          setError(t("unknown_error"));
          setHasError(true);
          setTimeout(() => setHasError(false), 500);
        }
        return;
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("token", loginData.token);

      const userResponse = await fetch(`${API_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(t("unknown_error"));
      }

      const userData = await userResponse.json();
      
      const { userId, firstName, role } = userData;

      localStorage.setItem("userID", userId);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("role", role);

      setSuccessMessage(true);
      setUserID(userId, firstName, role);

      setTimeout(() => {
        resetForm();
        onClose();
        if (role === "ADMIN") {
          navigate("/homeadmin"); // ไปหน้า ADMIN
        } else if (role === "USER") {
          navigate("/home"); // ไปหน้า ADMIN
        } 
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="animate-fadeIn2Delay1 font-kanit fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-fadeIn bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        {!successMessage && (
          <h2 className="flex justify-center items-center text-xl font-bold mb-6 text-gray-700">
            {t("login")}
            <FaUser className="ml-2" />
          </h2>
        )}
        {error && (
          <p className="animate-fadeIn2 text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}
        {successMessage && (
          <div className="animate-fadeIn2 flex flex-col items-center mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
            <p className="text-green-500 text-xl text-center mt-2">
              {t("login_success")}
            </p>
          </div>
        )}
        {!successMessage && (
          <form onSubmit={handleSubmit} className={`space-y-4 ${hasError ? "animate-shake" : ""}`}>
            {[
              { id: "email", type: "text" },
              { id: "password", type: "password" },
            ].map(({ id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-base font-medium text-gray-700 relative top-[-2px]"
                >
                  {t(id)}
                </label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={t(`ph_${id}`)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {t("login")}
            </button>
          </form>
        )}
        {!successMessage && (
          <div className="mt-4 text-center text-sm text-gray-700">
            <span>{t("if1")} </span>
            <button
              onClick={() => {
                handleClose();
                openRegister();
              }}
              className="text-blue-500 hover:underline"
            >
              {t("register")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
