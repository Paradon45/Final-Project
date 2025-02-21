import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../component/ToastComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const GoogleMapTest = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();


  const location = useLocation();
  const { locationIds, planId } = location.state || {
    locationIds: [],
    planId: null,
  };

  console.log("Received planId:", planId);
  console.log("Received locationIds:", locationIds);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/location/landing`);
        const data = await response.json();

        const locationsArray = Object.values(data.locations);

        if (Array.isArray(locationsArray)) {
          setLocations(locationsArray);

          if (locationIds && Array.isArray(locationIds)) {
            const filtered = locationsArray.filter((loc) =>
              locationIds.includes(loc.locationId)
            );
            setFilteredLocations(filtered);
          } else {
            setFilteredLocations([]);
          }
        } else {
          console.error(
            "Data from API is not an object or cannot be converted to array:",
            data
          );
          setFilteredLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setFilteredLocations([]);
      }
    };

    fetchLocations();
  }, [locationIds]);

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
    if (map && filteredLocations.length > 0) {
      // ลบ Marker เก่าทิ้ง
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      // สร้าง Marker สำหรับแต่ละสถานที่
      const newMarkers = filteredLocations.map((loc) => {
        return new window.google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map,
          title: loc.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // ไอคอนปกติ
        });
      });

      setMarkers(newMarkers);
    }
  }, [map, filteredLocations]);

  useEffect(() => {
    if (map) {
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
    }
  }, [map]);

  const calculateRoutes = () => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !currentPosition ||
      filteredLocations.length < 1
    ) {
      console.error(
        "Directions service or renderer not initialized, or no current position."
      );
      return;
    }

    // ลบ Marker ของแต่ละสถานที่
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const waypoints = filteredLocations.slice(1).map((loc) => ({
      location: { lat: loc.latitude, lng: loc.longitude },
      stopover: true,
    }));

    const origin = { lat: currentPosition.lat, lng: currentPosition.lng };
    const destination = {
      lat: filteredLocations[0].latitude,
      lng: filteredLocations[0].longitude,
    };

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
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

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);

          // ลบ Marker เก่าของตำแหน่งปัจจุบัน (ถ้ามี)
          markers.forEach((marker) => {
            if (marker.getTitle() === "ตำแหน่งปัจจุบัน") {
              marker.setMap(null);
            }
          });

          // สร้าง Marker สำหรับตำแหน่งปัจจุบัน
          const currentMarker = new window.google.maps.Marker({
            position: pos,
            map,
            title: "ตำแหน่งปัจจุบัน",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // ไอคอนพิเศษ
          });

          setMarkers((prevMarkers) => [...prevMarkers, currentMarker]);
          map.setCenter(pos);
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <div>
       <div className="text-left mb-4">
          <button
            onClick={() => navigate(-1)}
            className="font-kanit px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg shadow transition duration-200 mt-20 ml-6"
          >
            {t("back")}
          </button>
        </div>
      <div className="font-kanit flex flex-col items-center">
        <div
          id="map"
          style={{
            width: "90%",
            height: "500px",
            margin: "0 auto",
            marginTop: "0px",
          }}
        />

       

        <div className="mt-4 flex gap-4">
          <button
            onClick={getCurrentPosition}
            className="mb-4 px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            ตำแหน่งปัจจุบัน
          </button>

          <button
            onClick={calculateRoutes}
            disabled={!currentPosition} // ปิดการใช้งานถ้ายังไม่มีตำแหน่งปัจจุบัน
            className={`mb-4 px-5 py-3 rounded-lg shadow-md transition ${
              currentPosition
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            ค้นหาเส้นทาง
          </button>
        </div>

        <RouteInfo routes={routes} locations={filteredLocations} />
      </div>
    </div>
  );
};

const RouteInfo = ({ routes, locations }) => {
  const [fuelEfficiency, setFuelEfficiency] = useState(15); // อัตราสิ้นเปลืองน้ำมัน (กม./ลิตร)
  const { ToastComponent, showToast } = useToast();

  const calculateFuelCost = (totalDistance) => {
    const fuelUsed = totalDistance / fuelEfficiency; // ปริมาณน้ำมันที่ใช้ (ลิตร)
    const fuelCost = fuelUsed * 35.35; // ค่าใช้จ่ายน้ำมัน (บาท)
    return fuelCost.toFixed(2); // ปัดเศษเป็นทศนิยม 2 ตำแหน่ง
  };

  const handleSave = async (totalFuelCost) => {
    const selectedPlanId = localStorage.getItem("selectedPlanId"); // ดึง planId จาก localStorage
    if (!selectedPlanId) {
      console.error("No planId found.");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/plan/${selectedPlanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ budget: totalFuelCost }), // ส่ง totalFuelCost ไปอัปเดต budget
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Budget updated successfully:", data);
      showToast("บันทึกค่าใช้จ่ายน้ำมันสำเร็จ!");
    } catch (error) {
      console.error("Error updating budget:", error);
      showToast("เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่ายน้ำมัน");
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

        {/* เพิ่มช่องกรอกอัตราสิ้นเปลืองน้ำมัน */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 text-lg">
            อัตราสิ้นเปลืองน้ำมัน (กม./ลิตร):
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
                // หาชื่อสถานที่จาก filteredLocations
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
                <strong>
                  ค่าใช้จ่ายน้ำมัน (แก๊สโซฮอล 95 ลิตรละ 35.35 บาท) :
                </strong>{" "}
                {totalFuelCost} บาท
              </p>

              {/* ปุ่มบันทึกค่าใช้จ่ายน้ำมัน */}
              <button
                onClick={() => handleSave(totalFuelCost)}
                className="px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition mt-4"
              >
                บันทึกค่าใช้จ่ายน้ำมัน
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoogleMapTest;
