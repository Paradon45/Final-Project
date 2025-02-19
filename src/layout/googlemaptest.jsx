import { useEffect, useState } from "react";
import locations from "./testlocation.json";

const GoogleMapTest = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API failed to load.");
        return;
      }

      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 16.4321, lng: 102.8236 },
        zoom: 10,
      });

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
    if (map && locations.length > 0) {
      // ลบ Marker เก่าทิ้ง
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      // สร้าง Marker สำหรับแต่ละสถานที่
      const newMarkers = locations.map((loc) => {
        return new window.google.maps.Marker({
          position: { lat: loc.latitude, lng: loc.longitude },
          map,
          title: loc.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // ไอคอนปกติ
        });
      });

      setMarkers(newMarkers);
    }
  }, [map, locations]);

  useEffect(() => {
    if (map) {
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer({ map }));
    }
  }, [map]);

  const calculateRoutes = () => {
    if (!directionsService || !directionsRenderer || !currentPosition || locations.length < 1) {
      console.error("Directions service or renderer not initialized, or no current position.");
      return;
    }

    // ลบ Marker ของแต่ละสถานที่
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const waypoints = locations.slice(1).map((loc) => ({
      location: { lat: loc.latitude, lng: loc.longitude },
      stopover: true,
    }));

    const origin = { lat: currentPosition.lat, lng: currentPosition.lng };
    const destination = { lat: locations[0].latitude, lng: locations[0].longitude };

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
      <div id="map" style={{ width: "100%", height: "400px" }} />
      <button
        onClick={calculateRoutes}
        style={{ marginTop: "10px", padding: "10px", backgroundColor: "blue", color: "white" }}
      >
        ค้นหาเส้นทาง
      </button>
      <button
        onClick={getCurrentPosition}
        style={{ marginTop: "10px", padding: "10px", backgroundColor: "green", color: "white" }}
      >
        ตำแหน่งปัจจุบัน
      </button>
      <RouteInfo routes={routes} />
    </div>
  );
};

const RouteInfo = ({ routes }) => {
  if (!routes || routes.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>เส้นทางทั้งหมด</h3>
      {routes.map((route, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <h4>เส้นทางที่ {index + 1}</h4>
          {route.legs.map((leg, legIndex) => (
            <div key={legIndex} style={{ marginBottom: "10px" }}>
              <p>
                <strong>จาก {leg.start_address} ไป {leg.end_address}</strong>
              </p>
              <p>ระยะทาง: {(leg.distance.value / 1000).toFixed(2)} กม.</p>
              <p>เวลา: {(leg.duration.value / 60).toFixed(2)} นาที</p>
            </div>
          ))}
          <p>
            <strong>รวมระยะทาง:</strong> {route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000} กม. |
            <strong> รวมเวลา:</strong> {route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60} นาที
          </p>
        </div>
      ))}
    </div>
  );
};

export default GoogleMapTest;