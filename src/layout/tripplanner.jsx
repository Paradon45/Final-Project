import { useEffect, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useToast } from "../component/ToastComponent";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaTimes,FaPlus,FaMinus } from "react-icons/fa";

const locations = [
  { id: 1, name: "พระมหาธาตุแก่นนคร พระธาตุ 9 ชั้น", image: "place1.jpg" },
  { id: 2, name: "จุดชมวิวหินช้างสี", image: "place2.jpg" },
  { id: 3, name: "เขื่อนอุบลรัตน์", image: "place3.jpg" },
];

function TripPlanner() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { ToastComponent, showToast } = useToast();
  const { t } = useTranslation();
  const [days, setDays] = useState([{ id: 1, places: [null] }]);

  const addDay = () => {
    setDays([...days, { id: days.length + 1, places: [null] }]);
  };

  const removeDay = (dayId) => {
    if (dayId !== 1) {
      setDays(days.filter((day) => day.id !== dayId));
    }
  };

  const addPlace = (dayId) => {
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, places: [...day.places, null] } : day
      )
    );
  };

  const removeLastPlace = (dayId) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          if (day.places.length === 1) {
            showToast("ต้องมีสถานที่อย่างน้อย 1 สถานที่");
            return day;
          }
          return { ...day, places: day.places.slice(0, -1) };
        }
        return day;
      })
    );
  };

  const updatePlace = (dayId, index, placeId) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          const updatedPlaces = [...day.places];
          updatedPlaces[index] = locations.find(
            (loc) => loc.id === parseInt(placeId)
          );
          return { ...day, places: updatedPlaces };
        }
        return day;
      })
    );
  };

  return (
    <div>
      {ToastComponent}
      <div className="font-kanit animate-fadeIn max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-4 md:p-16">
        <h1 className="text-4xl font-bold text-center mb-6 flex justify-center items-center">
          {t("tripplanner")}
          <FaMapMarkedAlt className="text-orange-500 ml-2 mt-1 hover:text-yellow-500 transition duration-300" />
        </h1>
        <div className="animate-fadeInDelay1 w-20 h-1 bg-orange-500 mx-auto mb-7 rounded-lg"></div>

        <AnimatePresence>
          {days.map((day) => (
            <motion.div
              key={day.id}
              className="mb-6 p-8 bg-white rounded-lg shadow-md relative"
              initial={{ opacity: 0, scale: 0.9 }} // เริ่มต้นเล็กและจาง
              animate={{ opacity: 1, scale: 1 }} // ค่อยๆ ขยายขึ้น
              exit={{ opacity: 0, scale: 0.9 }} // ค่อยๆ หายไปเมื่อถูกลบ
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold flex-grow">
                  {t("day")} {day.id}
                </h2>
                {day.id !== 1 && (
                  <button
                    onClick={() => removeDay(day.id)}
                    className=" text-red-500 px-3 py-0 rounded text-2xl font-semibold absolute top-2 right-0  hover:text-red-600 duration-200"
                  >
                    <FaTimes/>
                  </button>
                )}

                <div className="flex space-x-3 ml-4 mr-5">
                  <button
                    className="bg-green-500 text-white px-3 py-2 rounded text-base hover:bg-green-600 duration-200"
                    onClick={() => addPlace(day.id)}
                  >
                    <FaPlus/>
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded text-base hover:bg-red-600 duration-200"
                    onClick={() => removeLastPlace(day.id)}
                  >
                    <FaMinus/>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-300 bg-gray-100 rounded-lg p-2">
                <div className="flex flex-nowrap space-x-4">
                  <AnimatePresence>
                    {day.places.map((place, index) => (
                      <motion.div
                        key={index}
                        className="flex-none w-72 bg-gray-50 p-3 rounded-lg shadow"
                        initial={{ opacity: 0, scale: 0.8 }} // เริ่มต้นจางและเล็ก
                        animate={{ opacity: 1, scale: 1 }} // ค่อยๆ ขยายและชัดขึ้น
                        exit={{ opacity: 0, scale: 0.8 }} // ค่อยๆ หายไปเมื่อถูกลบ
                        transition={{ duration: 0.3 }} // ความเร็วของ Animation
                      >
                        <select
                          className="p-2 border rounded w-full"
                          onChange={(e) =>
                            updatePlace(day.id, index, e.target.value)
                          }
                        >
                          <option value="">{t("choose")}</option>
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                        {place && (
                          <div className="flex items-center gap-2 mt-2">
                            <img
                              src={place.image}
                              alt={place.name}
                              className="w-64 h-24 rounded"
                            />
                            <span>{place.name}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 duration-200"
          onClick={addDay}
        >
          {t("addday")}
        </button>

        <button className="block mx-auto mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 duration-200">
          {t("save")}
        </button>
      </div>
    </div>
  );
}

export default TripPlanner;
