import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAddressCard, FaCheckCircle } from "react-icons/fa";

const Register = ({ isOpen, onClose, openLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [errorpass, setErrorpass] = useState(null);
  const [errorconfirmpass, setErrorConfirmPass] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { t } = useTranslation();

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError(null);
    setSuccessMessage(false);
    setErrorpass(null);
    setErrorConfirmPass(null);
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
    setErrorpass(null);
    setErrorConfirmPass(null);
    setSuccessMessage(false);

    if (formData.password.length < 8) {
      setErrorpass(t("pass_length")); // "Password must be at least 8 characters"
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorConfirmPass(t("pass_mismatch")); // "Passwords do not match"
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError(t("email_error"));
          setHasError(true);
          setTimeout(() => setHasError(false), 500);
        } else {
          setError(t("unknown_error"));
          setHasError(true);
          setTimeout(() => setHasError(false), 500);
        }
        return;
      }

      setSuccessMessage(true);

      setTimeout(() => {
        resetForm();
        onClose();
        openLogin();
      }, 2000);
    } catch (err) {}
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
            {t("register")}
            <FaAddressCard className="ml-2" />
          </h2>
        )}
        {error && (
          <p
            className="animate-fadeIn2 text-red-500 text-sm text-center mb-4 "
          >
            {error}
          </p>
        )}
        {successMessage && (
          <div className="animate-fadeIn2 flex flex-col items-center mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
            <p className="text-green-500 text-xl text-center mt-2">
              {t("register_success")}
            </p>
          </div>
        )}
        {!successMessage && (
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${hasError ? "animate-shake" : ""}`}
          >
            {[
              { id: "firstName", type: "text" },
              { id: "lastName", type: "text" },
              { id: "phone", type: "text" },
              { id: "email", type: "email" },
              { id: "password", type: "password" },
              { id: "confirmPassword", type: "password" },
            ].map(({ id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 relative top-[-2px]"
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
                {id === "password" && errorpass && (
                  <p className="animate-fadeIn2 text-red-500 text-sm mt-2">
                    {errorpass}
                  </p>
                )}
                {id === "confirmPassword" && errorconfirmpass && (
                  <p className="animate-fadeIn2 text-red-500 text-sm mt-2">
                    {errorconfirmpass}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {t("register")}
            </button>
          </form>
        )}
        {!successMessage && (
          <div className="mt-4 text-center text-sm text-gray-700">
            <span>{t("if2")} </span>
            <button
              onClick={() => {
                handleClose();
                openLogin();
              }}
              className="text-blue-500 hover:underline"
            >
              {t("login")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
