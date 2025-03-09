import { useEffect, useState } from "react";
import { useToast } from "../component/ToastComponent";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

const GoogleMapTest = ({ onSaveTravelCost }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanValid, setIsPlanValid] = useState(true);
  const { ToastComponent, showToast } = useToast();

  const userIdString = localStorage.getItem("userID");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedSelectedPlanId = localStorage.getItem("selectedPlanId");
    if (storedSelectedPlanId) {
      setSelectedPlan(storedSelectedPlanId);
    }
  }, []);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/plan/${selectedPlan}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const plan = data.plan;

        if (plan.userId !== userId) {
          setIsPlanValid(false);
          return;
        }

        setIsPlanValid(true);

        const locationsArray = plan.plan_location.map((loc) => ({
          locationId: loc.locationId,
          name: loc.location.name,
          latitude: parseFloat(loc.location.latitude),
          longitude: parseFloat(loc.location.longitude),
          imageUrl: loc.location.locationImg[0]?.url || "",
        }));

        setLocations(locationsArray);
        setSelectedLocations(locationsArray.map((loc) => loc.locationId));
        setSelectedStartLocation(locationsArray[0]?.locationId || null);
      } catch (error) {
        console.error("Error fetching plan details:", error);
      }
    };

    if (selectedPlan) fetchPlanDetails();
  }, [selectedPlan, API_URL, userId]);

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API failed to load.");
        return;
      }

      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: 16.4321, lng: 102.8236 },
          zoom: 10,
        }
      );

      setMap(mapInstance);
    };

    const loadGoogleMapsScript = () => {
      if (document.getElementById("google-maps-script")) {
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAP_API_KEY
      }&callback=initMap&loading=async&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onerror = () => console.error("Failed to load Google Maps API.");
      document.body.appendChild(script);
    };

    window.initMap = initMap;
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (map && locations.length > 0 && isPlanValid) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const newMarkers = locations
        .filter((loc) => selectedLocations.includes(loc.locationId))
        .map((loc) => {
          return new window.google.maps.Marker({
            position: { lat: loc.latitude, lng: loc.longitude },
            map,
            title: loc.name,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          });
        });

      setMarkers(newMarkers);
    }
  }, [map, locations, selectedLocations, isPlanValid]);

  useEffect(() => {
    if (map && isPlanValid) {
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
    }
  }, [map, isPlanValid]);

  const handleLocationSelect = (locationId) => {
    // ถ้า location นี้เป็น startLocation และกำลังจะยกเลิก checkbox
    if (selectedStartLocation === locationId && selectedLocations.includes(locationId)) {
      showToast("ไม่สามารถยกเลิกได้เนื่องจากจุดเริ่มต้นถูกเลือก");
      return;
    }

    setSelectedLocations((prevSelected) =>
      prevSelected.includes(locationId)
        ? prevSelected.filter((id) => id !== locationId)
        : [...prevSelected, locationId]
    );
  };

  const handleStartLocationSelect = (locationId) => {
    // ถ้า location นี้ยังไม่ถูกเลือกใน checkbox
    if (!selectedLocations.includes(locationId)) {
      showToast("กรุณาเลือก checkbox ก่อนเลือก radio");
      return;
    }

    setSelectedStartLocation(locationId);
  };

  const calculateRoutes = () => {
    if (
      !directionsService ||
      !directionsRenderer ||
      selectedLocations.length < 1 ||
      !isPlanValid
    ) {
      console.error(
        "Directions service or renderer not initialized, or no locations selected."
      );
      return;
    }

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const waypoints = selectedLocations
      .filter((locationId) => locationId !== selectedStartLocation)
      .map((locationId) => {
        const loc = locations.find((l) => l.locationId === locationId);
        return loc
          ? {
              location: { lat: loc.latitude, lng: loc.longitude },
              stopover: true,
            }
          : null;
      })
      .filter((loc) => loc !== null);

    const startLocation = locations.find(
      (loc) => loc.locationId === selectedStartLocation
    );
    const origin = startLocation
      ? { lat: startLocation.latitude, lng: startLocation.longitude }
      : null;

    const destination = waypoints[waypoints.length - 1]?.location || origin;

    if (!origin || !destination) {
      console.error("No valid origin or destination.");
      return;
    }

    directionsService.route(
      {
        origin,
        destination,
        waypoints: waypoints.slice(0, -1),
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setRoutes(response.routes);
          directionsRenderer.setDirections(response);
        } else {
          console.error("Directions request failed due to", status);
        }
      }
    );
  };

  return (
    <div>
      {ToastComponent}
      <div className="font-kanit flex flex-col items-center">
        {!isPlanValid ? (
          <div className="text-center mt-40">
            <p className="text-xl text-gray-700 mb-4">
              คุณไม่มีสิทธิ์เข้าถึงแผนการเดินทางนี้
            </p>
          </div>
        ) : (
          <>
            <div
              id="map"
              style={{
                width: "85%",
                height: "500px",
                margin: "0 auto",
                marginTop: "30px",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e5e7eb",
              }}
            />

            <div className="overflow-x-auto border border-gray-300 bg-gray-100 rounded-lg p-2 w-10/12 mt-6 mb-10">
              <div className="flex flex-nowrap space-x-4">
                <AnimatePresence>
                  {locations.map((loc, index) => (
                    <motion.div
                      key={index}
                      className="flex-none w-6/12 bg-gray-50 p-3 rounded-lg shadow"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(loc.locationId)}
                          onChange={() => handleLocationSelect(loc.locationId)}
                          className="mr-2 border-2"
                        />
                        <p className="text-gray-400 text-xs">
                        เลือกจุดเริ่ม:
                        </p>
                        <input
                          type="radio"
                          name="startLocation"
                          checked={selectedStartLocation === loc.locationId}
                          onChange={() => handleStartLocationSelect(loc.locationId)}
                          className="mr-2 border-2"
                          disabled={!selectedLocations.includes(loc.locationId)} // ปิด radio ถ้า checkbox ไม่ถูกเลือก
                        />
                        <img
                          src={loc.imageUrl}
                          alt={loc.name}
                          className="w-64 h-24 rounded object-cover"
                        />
                        <span className="text-sm">{loc.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateRoutes}
                disabled={selectedLocations.length === 0}
                className={`mb-4 px-5 py-3 rounded-lg shadow-md transition ${
                  selectedLocations.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                ค้นหาเส้นทาง
              </button>
            </div>

            <RouteInfo
              routes={routes}
              locations={locations}
              planId={selectedPlan}
              onSaveTravelCost={onSaveTravelCost}
            />
          </>
        )}
      </div>
    </div>
  );
};

// ส่วนของ RouteInfo เหมือนเดิม

const RouteInfo = ({ routes, locations, planId, onSaveTravelCost }) => {
  const [fuelEfficiency, setFuelEfficiency] = useState(4);
  const { ToastComponent, showToast } = useToast();

  const calculateFuelCost = (totalDistance) => {
    const fuelCost = totalDistance * fuelEfficiency;
    return fuelCost.toFixed(2);
  };

  const handleSave = async (totalFuelCost) => {
    if (!planId) {
      console.error("No planId provided.");
      return;
    }
    showToast("บันทึกค่าเดินทางสำเร็จ!");

    if (onSaveTravelCost) {
      onSaveTravelCost(totalFuelCost);
    }
  };

  if (!routes || routes.length === 0) return null;

  return (
    <div>
      {ToastComponent}
      <div className="max-w-7xl mx-auto p-6 bg-gray-100 font-kanit mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          เส้นทางทั้งหมด
        </h3>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-lg">
            อัตราสิ้นเปลือง :
          </label>
          <input
            type="number"
            value={fuelEfficiency}
            onChange={(e) => setFuelEfficiency(parseFloat(e.target.value))}
            className="p-2 border rounded w-full text-lg"
            min="1"
            step="0.1"
          />
        </div>

        {routes.map((route, index) => {
          const totalDistance =
            route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000;
          const totalFuelCost = calculateFuelCost(totalDistance);

          return (
            <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
              {route.legs.map((leg, legIndex) => {
                const startLocation = locations.find(
                  (loc) =>
                    loc.latitude === leg.start_location.lat() &&
                    loc.longitude === leg.start_location.lng()
                );
                const endLocation = locations.find(
                  (loc) =>
                    loc.latitude === leg.end_location.lat() &&
                    loc.longitude === leg.end_location.lng()
                );

                return (
                  <div
                    key={legIndex}
                    className="animate-fadeIn mb-4 p-3 bg-white rounded-lg shadow-sm"
                  >
                    <p className="text-lg text-gray-700 mb-2">
                      <strong>
                        จาก{" "}
                        {startLocation ? startLocation.name : leg.start_address}{" "}
                        ไปยัง {endLocation ? endLocation.name : leg.end_address}
                      </strong>
                    </p>
                    <p className="text-gray-600 text-base">
                      🚗 ระยะทาง : {(leg.distance.value / 1000).toFixed(2)} กม.
                    </p>
                    <p className="text-gray-600 text-base">
                      ⏳ เวลา : {(leg.duration.value / 60).toFixed(2)} นาที
                    </p>
                  </div>
                );
              })}
              <p className="font-semibold text-gray-800 text-lg mt-3 mb-2">
                <strong>รวมระยะทาง :</strong> {totalDistance.toFixed(2)} กม. |
                <strong> รวมเวลา :</strong>{" "}
                {(
                  route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) /
                  60
                ).toFixed(2)}{" "}
                นาที
              </p>
              <p className="font-semibold text-gray-800 text-lg">
                <strong>ค่าเดินทาง :</strong> {totalFuelCost} บาท
              </p>

              <button
                onClick={() => handleSave(totalFuelCost)}
                className="px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition mt-4"
              >
                บันทึกค่าเดินทาง
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoogleMapTest;