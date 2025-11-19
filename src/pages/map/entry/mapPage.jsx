import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../ui/mapPage.css";
import { Resizable } from "re-resizable";
import { useLocation, useNavigate } from "react-router-dom";

import ReportIcon from "../../../component/icons/reportIcon";
import GpsIcon from "../../../component/icons/gpsIcon";
import gps_move from "../../../assets/map/gps_move.png";
import gps_stop from "../../../assets/map/gps_stop.png";
import SettingIcon from "../../../component/icons/setting";

import {
  apiGetMapPageDataByFilter,
  apiGetMapPagePublicData,
  apiGetMapPageUserData,
} from "../../../api/map";

import CctvIcon from "../../../component/icons/cctvIcon";
import CarIcon from "../../../component/icons/carIcon";
import BellIcon from "../../../component/icons/bellIcon";
import DetalIcon from "../../../component/icons/detalIcon";
import useDistance from "../../../hook/useDistance";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MapPageSearchBar from "../../../component/MapSearchBar/MapSearchBar";
import MapSeverity from "../../../component/MapSeverity/MapSeverity";

import reportIcon from "../../../assets/map/marker/report.svg";
import bellIcon from "../../../assets/map/marker/bell.svg";
import carIcon from "../../../assets/map/marker/car.svg";
import cctvIcon from "../../../assets/map/marker/cctv.svg";
import pingIcon from "../../../assets/map/marker/ping.svg";
import detalIcon from "../../../assets/map/marker/detal.svg";

const FILTER_OPTIONS = [
  { key: "user", label: "이웃 제보" },
  { key: "police", label: "치안 민원" },
  { key: "cctv", label: "CCTV" },
  { key: "traffic", label: "교통사고" },
  { key: "bell", label: "비상벨" },
];

const MapPage = () => {
  const nav = useNavigate();

  // 검색에서 넘어온 state
  const state = useLocation().state;
  const searchLat = state?.lat;
  const searchLng = state?.lng;
  const searchKeyword = state?.search;

  // 지도 ref
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  // 검색 키워드 표시용
  const [place, setPlace] = useState(searchKeyword || "");

  // 데이터 및 상태
  const [data, setData] = useState([]);
  const [selectData, setSelectData] = useState({});
  const [isTracking, setIsTracking] = useState(false);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    heading: null,
  });

  const distance = useDistance();

  const [showGpsButtons, setShowGpsButtons] = useState(true);
  const [resizeHeight, setResizeHeight] = useState(15.0);

  // 필터
  const [filters, setFilters] = useState(() =>
    FILTER_OPTIONS.reduce((acc, { key }) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  // 활성 필터 계산
  const activeFilterKeys = useMemo(
    () => Object.keys(filters).filter((key) => filters[key]),
    [filters]
  );

  // 지도 반경
  const getApproxMapRadiusKm = () => {
    if (!mapRef.current) return 2;
    const level = mapRef.current.getLevel();
    const levels = { 3: 2, 4: 4, 5: 8, 6: 16, 7: 32 };
    return levels[level] || 2;
  };

  // 지도 중심 이동
  const moveMapCenter = useCallback((lat, lng) => {
    if (!mapRef.current || !window.kakao?.maps) return;
    const center = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(center);
  }, []);

  // 사용자 GPS 마커
  const updateUserMarker = useCallback(
    (lat, lng, heading, tracking = false) => {
      if (!mapRef.current || !window.kakao?.maps) return;

      const position = new window.kakao.maps.LatLng(lat, lng);
      const hasHeading = typeof heading === "number" && !Number.isNaN(heading);

      if (!userMarkerRef.current) {
        const container = document.createElement("div");
        container.className = "mapPage-gpsMarker";

        const img = document.createElement("img");
        img.alt = "user";
        container.appendChild(img);

        const overlay = new window.kakao.maps.CustomOverlay({
          content: container,
          position,
          xAnchor: 0.5,
          yAnchor: 0.5,
        });

        overlay.setMap(mapRef.current);
        userMarkerRef.current = { overlay, img, container };
      }

      userMarkerRef.current.overlay.setPosition(position);
      userMarkerRef.current.img.src = tracking ? gps_move : gps_stop;
      userMarkerRef.current.container.style.transform = hasHeading
        ? `translate(-50%, -50%) rotate(${heading}deg)`
        : "translate(-50%, -50%)";
    },
    []
  );

  // 현재 위치 가져와 지도 이동
  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("위치 정보를 가져올 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          lat: coords.latitude,
          lng: coords.longitude,
          heading: null,
        });
        moveMapCenter(coords.latitude, coords.longitude);
        updateUserMarker(coords.latitude, coords.longitude, null, false);
      },
      () => alert("현재 위치를 불러올 수 없습니다."),
      { enableHighAccuracy: true }
    );
  }, [moveMapCenter, updateUserMarker]);

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 4,
    };

    mapRef.current = new window.kakao.maps.Map(container, options);

    // 검색으로 들어온 경우 그 위치로 이동
    if (searchLat && searchLng) {
      setPlace(searchKeyword || "");
      setUserLocation({ lat: searchLat, lng: searchLng, heading: null });
      moveMapCenter(searchLat, searchLng);
      return;
    }

    // 기본: 현재 위치
    moveToCurrentLocation();
  }, [
    searchLat,
    searchLng,
    searchKeyword,
    moveMapCenter,
    moveToCurrentLocation,
  ]);

  // 지도 데이터 및 핑 마커 표시
  useEffect(() => {
    if (!userLocation.lat || !userLocation.lng) return;

    const fetchData = async () => {
      const radius = getApproxMapRadiusKm();

      const response = await apiGetMapPageDataByFilter({
        filters: activeFilterKeys,
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius,
      });

      setData(response || []);

      // 기존 마커 제거
      if (window._clusterer) window._clusterer.clear();
      if (window._markers) window._markers.forEach((m) => m.setMap(null));
      window._markers = [];
      if (window._pingMarker) {
        window._pingMarker.setMap(null);
        window._pingMarker = null;
      }

      const iconMap = {
        user: reportIcon,
        police: detalIcon,
        traffic: carIcon,
        cctv: cctvIcon,
        bell: bellIcon,
      };

      // 클러스터 설정
      if (mapRef.current && window.kakao?.maps) {
        if (!window._clusterer) {
          window._clusterer = new window.kakao.maps.MarkerClusterer({
            map: mapRef.current,
            averageCenter: true,
            minLevel: 6,
            gridSize: 40,
          });
        }

        const markers = (response || [])
          .filter((item) => item.lat && item.lng)
          .map((item) => {
            const icon = iconMap[item.filterType] || reportIcon;

            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(item.lat, item.lng),
              image: new window.kakao.maps.MarkerImage(
                icon,
                new window.kakao.maps.Size(24, 24)
              ),
            });

            window.kakao.maps.event.addListener(marker, "click", () =>
              onClickListItem(item)
            );
            return marker;
          });

        window._clusterer.addMarkers(markers);
        window._markers = markers;

        // 검색 핑 표시
        if (searchLat && searchLng) {
          const pingMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(searchLat, searchLng),
            image: new window.kakao.maps.MarkerImage(
              pingIcon,
              new window.kakao.maps.Size(32, 32),
              { offset: new window.kakao.maps.Point(16, 32) }
            ),
            zIndex: 1000,
          });
          pingMarker.setMap(mapRef.current);
          window._pingMarker = pingMarker;
        }
      }
    };

    fetchData();
  }, [
    activeFilterKeys,
    userLocation.lat,
    userLocation.lng,
    searchLat,
    searchLng,
  ]);

  // 리스트 항목 클릭
  const onClickListItem = (item) => {
    if (item.sourceType === "USER") {
      setSelectData(apiGetMapPageUserData(item.markerId));
    } else {
      setSelectData(apiGetMapPagePublicData(item.markerId));
      setResizeHeight(15.0);
      setShowGpsButtons(true);
    }
  };

  return (
    <section className="mapPage">
      <div className="mapPage-searchBar">
        <MapPageSearchBar
          place={place}
          setSelectData={setSelectData}
          selectData={selectData}
        />
        <div className="mapPage-searchSettings">
          <SettingIcon />
        </div>
      </div>

      <Resizable
        className="mapPage-bottomSheet"
        defaultSize={{ width: "100%", height: "15vh" }}
        size={{ width: "100%", height: `${resizeHeight}vh` }}
        maxHeight="75vh"
        minHeight="15vh"
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
          top: <div className="mapPage-bottomSheetBar" />,
        }}
        onResize={(e, direction, ref) => {
          const vh = (parseFloat(ref.style.height) / window.innerHeight) * 100;
          setShowGpsButtons(vh <= 7.7);
        }}
        onResizeStop={(e, direction, ref) => {
          const vh = (parseFloat(ref.style.height) / window.innerHeight) * 100;
          setResizeHeight(Number(vh.toFixed(3)));
        }}
      >
        <div className="mapPage-bottomSheetContent">
          {showGpsButtons && (
            <div className="mapPage-mapButtons">
              <button type="button" onClick={() => nav("/report")}>
                <ReportIcon />
              </button>
              <button type="button" onClick={() => setIsTracking(!isTracking)}>
                <GpsIcon active={isTracking} />
              </button>
            </div>
          )}

          {Object.keys(selectData).length === 0 && (
            <>
              <div className="mapPage-filterList">
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`mapPage-filterItem${
                      filters[key] ? " mapPage-filterItem--active" : ""
                    }`}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mapPage-list scroll">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="mapPage-list-item"
                    onClick={() => onClickListItem(item)}
                  >
                    <div className="mapPage-list-item-icon">
                      {item.filterType === "user" && <ReportIcon />}
                      {item.filterType === "police" && <DetalIcon />}
                      {item.filterType === "cctv" && <CctvIcon />}
                      {item.filterType === "traffic" && <CarIcon />}
                      {item.filterType === "bell" && <BellIcon />}
                    </div>

                    <div className="mapPage-list-item-content">
                      <p className="sub-title-3">{item.title}</p>

                      <div className="body-2">
                        <span>
                          {Math.round(
                            distance(
                              { lat: userLocation.lat, lng: userLocation.lng },
                              { lat: item.lat, lng: item.lng }
                            )
                          )}
                          m
                        </span>
                        <div className="mapPage-dot" />
                        <span>{item.location || "주소 정보 없음"}</span>
                      </div>
                    </div>

                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                ))}
              </div>
            </>
          )}

          {selectData.sourceType === "PUBLIC" && (
            <div className="mapPage-public-detail">
              <p className="sub-title-2">{selectData.title}</p>
              <MapSeverity severity={selectData.severity} />
              <p className="body-3">{selectData.filterType}</p>
              <p className="body-2">
                {selectData.location}
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(selectData.location)
                  }
                >
                  복사
                </span>
              </p>
            </div>
          )}

          {selectData.report && (
            <div className="mapPage-public-detail scroll">
              <div>
                <p className="sub-title-2">{selectData.report.title}</p>
                <MapSeverity severity={selectData.aiAnalysis.severityLevel} />
              </div>
              <p className="body-3">이웃 제보</p>
              <p className="body-2">
                {selectData.report.lotAddress}
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(selectData.report.lotAddress)
                  }
                >
                  복사
                </span>
              </p>

              <div className="mapPage-ai">
                <p className="sub-title-4">AI요약</p>
                <p className="body-2">{selectData.aiAnalysis.summaryText}</p>
              </div>

              <div className="mapPage-report-description scroll">
                <p className="sub-title-4">글 전체보기</p>
                <p className="body-2">{selectData.report.description}</p>
              </div>
            </div>
          )}
        </div>
      </Resizable>

      <div id="map" style={{ width: "100vw", height: "90vh" }}></div>
    </section>
  );
};

export default MapPage;
