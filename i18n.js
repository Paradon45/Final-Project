import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

import en from "./src/TH_EN/en.json";
import th from "./src/TH_EN/th.json";

// ฟังก์ชันโหลดข้อความแปลจาก API
const loadTranslations = async (lang) => {
  try {
    const response = await axios.get(`/api/translations?lang=${lang}`);
    return response.data; // JSON ที่ได้จาก API
  } catch (error) {
    console.error("Error loading translations:", error);
    return {}; // ใช้ object เปล่าเมื่อโหลดล้มเหลว
  }
};

// การตั้งค่า i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en, // ข้อความแปลภาษาอังกฤษ
    },
    th: {
      translation: th, // ข้อความแปลภาษาไทย
    },
  },
  lng: "th", // ภาษาเริ่มต้น
  fallbackLng: "en", // ใช้ภาษาอังกฤษหากไม่มีข้อความแปล
  debug: true, // แสดง Debug ใน console
  interpolation: {
    escapeValue: false, // ปิดการ escape HTML
  },
});

// ฟังก์ชันอัปเดตภาษา
export const updateLanguage = async (lang) => {
  try {
    const translations = await loadTranslations(lang);
    i18n.addResources(lang, "translation", translations); // เพิ่มข้อความแปลแบบ dynamic
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  } catch (error) {
    console.error("Failed to update language:", error);
  }
};

export default i18n;
