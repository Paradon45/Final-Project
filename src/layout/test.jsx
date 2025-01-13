import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateLanguage } from "../../i18n";

const App = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      await updateLanguage("en"); // โหลดภาษาเริ่มต้น
      setLoading(false);
    };
    loadLang();
  }, []);

  const handleLanguageChange = async (lang) => {
    setLoading(true);
    await updateLanguage(lang);
    setLoading(false);
  };

  if (loading) return <div>Loading translations...</div>;

  return (
    <div className="p-5">
      <button
        onClick={() => handleLanguageChange("en")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("th")}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        ภาษาไทย
      </button>
      <h1 className="text-3xl font-bold mt-5">{t("welcome")}</h1>
      <p className="mt-3 text-lg">{t("about")}</p>
      <button
        onClick={() => handleLanguageChange("en")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("th")}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
      >
        ภาษาไทย
      </button>
    </div>
  );
};

export default App;
