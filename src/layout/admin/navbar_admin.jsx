import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../login";
import Register from "../register";
import Translations from "../../system/translations";
import { useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userID, setUserID] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserID = localStorage.getItem("userID");
    if (token && storedUserID) {
      // Assume user is logged in if token and userID are present
      setUserID(storedUserID);
      setFirstName(localStorage.getItem("firstName") || "User"); // Default to "User" if firstName is not stored
    }
   

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    navigate("/home");
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("firstName");
    setUserID(null);
    setFirstName(null);
  };

  return (
    <>
      <nav
        className={`font-kanit bg-gradient-to-r from-gray-500 to-gray-700 text-white py-4 fixed w-full top-0 left-0 z-50 shadow-lg transition-transform duration-500 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Left Menu */}
          <ul className="flex gap-8">
            {["homeadmin", "attractionadmin", "cafepageadmin", "staypageadmin", "recommendadmin", "planadmin"].map(
              (item) => (
                <li key={item}>
                  <Link
                    to={`/${item}`}
                    className="hover:text-yellow-300 transition duration-300"
                    style={{
                      width: "70px",
                      textAlign: "center",
                    }}
                  >
                    {t(item)}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right Menu */}
          <ul className="flex gap-4 items-center">
            <li>
              <Translations />
            </li>
            {userID ? (
              <>
              <Link to={`/addlocationadmin`} className="text-red-400 hover:text-yellow-300 font-bold transition duration-300"
              style={{
                width: "150px",
                textAlign: "center",
              }}>{t("edit")}</Link>
                <li className="animate-fadeIn2 text-yellow-300 font-bold">{firstName}</li>
                <li className="animate-fadeIn2 text-orange-500 ">(ADMIN)</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="animate-fadeIn2 hover:text-yellow-300 transition duration-300 px-3 py-1 border border-yellow-400 rounded-full"
                    style={{
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    {t("logout")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="animate-fadeIn2 hover:text-yellow-300 transition duration-300 px-3 py-1 border border-yellow-400 rounded-full"
                    style={{
                      width: "110px",
                      textAlign: "center",
                    }}
                  >
                    {t("register")}
                  </button>
                </li>
                <li className="animate-fadeIn2 text-yellow-400">|</li>
                <li>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="animate-fadeIn2 hover:text-yellow-300 transition duration-300 px-3 py-1 border border-yellow-400 rounded-full"
                    style={{
                      width: "110px",
                      textAlign: "center",
                    }}
                  >
                    {t("login")}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Login Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        setUserID={(id, name) => {
          setUserID(id);
          setFirstName(name);
          localStorage.setItem("userID", id);
          localStorage.setItem("firstName", name);
        }}
      />

      {/* Register Modal */}
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        openLogin={() => {
          setIsLoginOpen(true);
          setIsRegisterOpen(false);
        }}
      />
    </>
  );
};

export default NavbarAdmin;
