import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateLanguage } from "../../i18n";

const Translations = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language); // ติดตามภาษาปัจจุบัน

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "th" : "en"; // สลับภาษา
    i18n.changeLanguage(newLang); // เปลี่ยนภาษาใน i18next
    setCurrentLang(newLang); // อัปเดตสถานะภาษา
  };
  return (
    <button
      onClick={toggleLanguage}
      className="animate-fadeIn2 text-yellow-400 hover:text-yellow-300"
      style={{
        width: "50px",
        textAlign: "center",
      }}
    >
      {currentLang === "en" ? "TH" : "EN"}
    </button>
  );
};

export default Translations;
