import { useCallback, useEffect, useRef, useState } from "react";
import "../ui/mapPage.css";
import { Resizable } from "re-resizable";
import { useNavigate } from "react-router-dom";
import ReportIcon from "../../../component/icons/reportIcon";
import GpsIcon from "../../../component/icons/gpsIcon";
import gps_move from "../../../assets/map/gps_move.png";
import gps_stop from "../../../assets/map/gps_stop.png";

const MapPage = () => {
  const nav = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);

  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null, heading: null });
  const [bottomSheetHeight, setBottomSheetHeight] = useState("15vh");

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      mapRef.current = new window.kakao.maps.Map(container, options);
    }
  }, []);

  const checkGeolocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return false;
    }

    if (!navigator.permissions?.query) {
      return true;
    }

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "denied") {
        alert("위치 정보 권한이 거부되었습니다. 브라우저 설정을 확인해주세요.");
        return false;
      }

      return true;
    } catch {
      return true;
    }
  }, []);

  const moveMapCenter = useCallback((lat, lon) => {
    if (mapRef.current && window.kakao && window.kakao.maps) {
      const moveLatLon = new window.kakao.maps.LatLng(lat, lon);
      mapRef.current.setCenter(moveLatLon);
    }
  }, []);

  const updateUserMarker = useCallback((lat, lon, heading, tracking = false) => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      return;
    }

    if (typeof lat !== "number" || typeof lon !== "number") {
      return;
    }

    const position = new window.kakao.maps.LatLng(lat, lon);
    const hasHeading = typeof heading === "number" && !Number.isNaN(heading);

    if (!markerRef.current) {
      const container = document.createElement("div");
      container.className = "gps-marker";
      const img = document.createElement("img");
      img.alt = "사용자 위치";
      container.appendChild(img);

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: container,
        yAnchor: 0.5,
        xAnchor: 0.5,
      });

      overlay.setMap(mapRef.current);

      markerRef.current = { overlay, container, img };
    }

    markerRef.current.overlay.setPosition(position);
    markerRef.current.overlay.setMap(mapRef.current);

    markerRef.current.img.src = tracking ? gps_move : gps_stop;
    markerRef.current.container.style.transform = hasHeading ? `translate(-50%, -50%) rotate(${heading}deg)` : "translate(-50%, -50%)";
  }, []);

  const moveToCurrentLocation = useCallback(async () => {
    const allowed = await checkGeolocationPermission();

    if (!allowed) {
      alert("위치 권한이 없어 위치 정보를 표시할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ lat, lon, heading: null });
        moveMapCenter(lat, lon);
        updateUserMarker(lat, lon, null, false);
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, [checkGeolocationPermission, moveMapCenter, updateUserMarker]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      if (userLocation.lat !== null && userLocation.lon !== null) {
        updateUserMarker(userLocation.lat, userLocation.lon, null, false);
      }
    }
  }, [updateUserMarker, userLocation.lat, userLocation.lon]);

  const startTracking = useCallback(async () => {
    const allowed = await checkGeolocationPermission();

    if (!allowed) {
      alert("위치 권한이 없어 실시간 위치 추적을 사용할 수 없습니다.");
      return false;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading } = pos.coords;
        setUserLocation({ lat: latitude, lon: longitude, heading });
        moveMapCenter(latitude, longitude);
        updateUserMarker(latitude, longitude, heading, true);
      },
      () => {
        alert("위치 정보를 실시간으로 가져올 수 없습니다.");
        stopTracking();
      },
      { enableHighAccuracy: true }
    );

    return true;
  }, [checkGeolocationPermission, moveMapCenter, stopTracking, updateUserMarker]);

  const toggleTracking = useCallback(async () => {
    if (isTracking) {
      stopTracking();
      setIsTracking(false);
      return;
    }

    const started = await startTracking();

    if (started) {
      setIsTracking(true);
    }
  }, [isTracking, startTracking, stopTracking]);

  useEffect(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  return (
    <section className="mapPage">
      <Resizable
        className="bottomSheet"
        defaultSize={{
          width: "100%",
          height: "15vh",
        }}
        maxHeight="75vh"
        onResizeStop={(e, direction, ref) => {
          const currentHeight = ref.style.height;
          setBottomSheetHeight(currentHeight);
        }}
        enable={{ top: true, right: false, bottom: false, left: false }}
        handleStyles={{
          top: {
            height: "32px",
            width: "100%",
            cursor: "ns-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1000,
          },
        }}
        handleComponent={{
          top: <div className="bar" />,
        }}>
        <div className="bottomSheet_content">
          <div className="map_button">
            <div
              onClick={() => {
                nav("/report");
                // FIXME: reportPage로 이동 링크 수정하기
              }}>
              <ReportIcon />
            </div>
            <div onClick={toggleTracking}>
              <GpsIcon active={isTracking} />
            </div>
          </div>
        </div>
      </Resizable>
      <div id="map" style={{ width: "100vw", height: "90vh" }}></div>
    </section>
  );
};

export default MapPage;
