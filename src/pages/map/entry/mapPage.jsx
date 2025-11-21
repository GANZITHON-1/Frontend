import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../ui/mapPage.css";
import { Resizable } from "re-resizable";
import { useLocation, useNavigate } from "react-router-dom";

import ReportIcon from "../../../component/icons/reportIcon";
import GpsIcon from "../../../component/icons/gpsIcon";
import gps_stop from "../../../assets/map/gps_stop.png";
import SettingIcon from "../../../component/icons/setting";

import { apiGetMapPageDataByFilter, apiGetMapPagePublicData, apiGetMapPageUserData } from "../../../api/map";

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
  // { key: "police", label: "치안 민원" },
  { key: "cctv", label: "CCTV" },
  { key: "traffic", label: "교통사고" },
  { key: "bell", label: "비상벨" },
];

const MapPage = () => {
  const nav = useNavigate();

  //  검색 결과로 전달되는 값 (좌표)
  const state = useLocation().state;
  const searchLat = state?.lat;
  const searchLng = state?.lng;
  const searchKeyword = state?.search;

  // 지도 관련
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [place, setPlace] = useState(searchKeyword || "");
  const [data, setData] = useState([]);

  // const watchIdRef = useRef(null);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    heading: null,
  });

  const [showGpsButtons, setShowGpsButtons] = useState(true);
  const [resizeHeight, setResizeHeight] = useState(15.0);

  const [selectData, setSelectData] = useState({});
  const isDetailOpen = Object.keys(selectData).length > 0;
  const distance = useDistance();

  // 필터
  const [filters, setFilters] = useState(() =>
    FILTER_OPTIONS.reduce((acc, { key }) => {
      acc[key] = true;
      return acc;
    }, {})
  );
  const activeFilterKeys = useMemo(() => Object.keys(filters).filter((key) => filters[key]), [filters]);

  // 지도 반경 계산
  const getApproxMapRadiusKm = useCallback(() => {
    if (!mapRef.current) return 2;
    const level = mapRef.current.getLevel();
    const levelToRadius = { 2: 1, 3: 2, 4: 4, 5: 8, 6: 16, 7: 32, 8: 64, 9: 128 };
    return levelToRadius[level] || 128;
  }, []);

  // 권한 체크
  const checkGeolocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return false;
    }

    if (!navigator.permissions?.query) return true;

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      if (status.state === "denied") {
        alert("위치 정보 권한이 거부되었습니다.");
        return false;
      }
      return true;
    } catch {
      return true;
    }
  }, []);

  /**
   * 지도 중심 이동
   */
  const moveMapCenter = useCallback((lat, lng) => {
    if (!mapRef.current || !window.kakao?.maps) return;
    const center = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(center);
  }, []);

  /**
   * GPS 사용자 마커 업데이트
   */
  const updateUserMarker = useCallback((lat, lng, heading) => {
    if (!mapRef.current || !window.kakao?.maps) return;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const position = new window.kakao.maps.LatLng(lat, lng);
    const hasHeading = typeof heading === "number";

    if (!markerRef.current) {
      const container = document.createElement("div");
      container.className = "mapPage-gpsMarker";

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
    markerRef.current.img.src = gps_stop;
    markerRef.current.container.style.transform = hasHeading ? `translate(-50%, -50%) rotate(${heading}deg)` : `translate(-50%, -50%)`;
  }, []);

  /**
   * 현재 위치로 이동
   */
  const moveToCurrentLocation = useCallback(async () => {
    const allowed = await checkGeolocationPermission();
    if (!allowed) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setUserLocation({ lat: latitude, lng: longitude, heading: null });
        moveMapCenter(latitude, longitude);
        updateUserMarker(latitude, longitude, null, false);
      },
      () => alert("위치 정보를 가져올 수 없습니다.")
    );
  }, [checkGeolocationPermission, moveMapCenter, updateUserMarker]);

  const handleGpsButtonClick = useCallback(() => {
    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  /**
   * 지도와 위치 정보를 초기화한다. location 값이 있으면 해당 위치로 이동한다.
   */
  useEffect(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 4,
    };

    mapRef.current = new window.kakao.maps.Map(container, options);

    // 검색해서 들어온 위치가 있다면 그 위치로 이동
    if (searchLat && searchLng) {
      setUserLocation({ lat: searchLat, lng: searchLng, heading: null });
      setPlace(searchKeyword || "");
      moveMapCenter(searchLat, searchLng);
      return;
    }

    moveToCurrentLocation();
  }, [searchLat, searchLng, searchKeyword, moveMapCenter, moveToCurrentLocation]);

  /**
   * 리스트 선택 시 상세보기
   */
  const onClickListItem = useCallback(async (item) => {
    if (!item) return;

    let detail = {};
    if (item.sourceType === "USER") {
      detail = (await apiGetMapPageUserData(item.markerId)) || {};
      setSelectData(detail);
      setResizeHeight(40);
    } else if (item.sourceType === "PUBLIC") {
      detail = (await apiGetMapPagePublicData(item.markerId)) || {};
      setSelectData(detail);
      setResizeHeight(15);
    } else {
      return;
    }

    setShowGpsButtons(false);
  }, []);

  /**
   * 지도 마커 + 핑 마커 표시
   */
  useEffect(() => {
    if (userLocation.lat === null || userLocation.lng === null) return;

    let isFetching = false;

    const fetchData = async () => {
      if (isFetching) {
        alert("데이터를 불러오는 중입니다.\n잠시만 기다려주세요.");
        return;
      }
      isFetching = true;

      const radius = getApproxMapRadiusKm();
      const response = await apiGetMapPageDataByFilter({
        filters: activeFilterKeys,
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: radius,
      });

      setData(response || []);

      // 기존 마커 정리
      if (window._clusterer) window._clusterer.clear();
      if (window._markers) {
        window._markers.forEach((m) => m.setMap(null));
      }
      window._markers = [];
      if (window._pingMarker) {
        window._pingMarker.setMap(null);
        window._pingMarker = null;
      }

      // 아이콘 매핑
      const iconMap = {
        user: reportIcon,
        police: detalIcon,
        traffic: carIcon,
        cctv: cctvIcon,
        bell: bellIcon,
      };

      if (mapRef.current && window.kakao?.maps) {
        if (!window._clusterer) {
          window._clusterer = new window.kakao.maps.MarkerClusterer({
            map: mapRef.current,
            averageCenter: true,
            minLevel: 4,
            gridSize: 40,
          });
        }

        const markers = (response || [])
          .filter((item) => item.lat && item.lng)
          .map((item) => {
            const iconSrc = iconMap[item.filterType?.toLowerCase()] || reportIcon;

            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(item.lat, item.lng),
              image: new window.kakao.maps.MarkerImage(iconSrc, new window.kakao.maps.Size(22, 22), { offset: new window.kakao.maps.Point(12, 24) }),
            });

            window.kakao.maps.event.addListener(marker, "click", () => onClickListItem(item));

            return marker;
          });

        window._clusterer.addMarkers(markers);
        window._markers = markers;

        // 검색 위치 핑 생성
        if (searchLat && searchLng) {
          const pingMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(searchLat, searchLng),
            image: new window.kakao.maps.MarkerImage(pingIcon, new window.kakao.maps.Size(32, 32), { offset: new window.kakao.maps.Point(16, 32) }),
            zIndex: 1000,
          });

          pingMarker.setMap(mapRef.current);
          window._pingMarker = pingMarker;
        }
      }
      isFetching = false;
    };

    fetchData();
  }, [activeFilterKeys, userLocation.lat, userLocation.lng, searchLat, searchLng, getApproxMapRadiusKm, onClickListItem]);

  useEffect(() => {
    if (isDetailOpen) {
      setShowGpsButtons(false);
      setResizeHeight((prev) => (prev < 40 ? 40 : prev));
    } else {
      setShowGpsButtons(true);
    }
  }, [isDetailOpen]);

  return (
    <section className="mapPage">
      {/* ===== 검색바 영역 ===== */}
      <div className="mapPage-searchBar">
        <MapPageSearchBar place={place} setSelectData={setSelectData} selectData={selectData} />
        <div className="mapPage-searchSettings">
          <SettingIcon />
        </div>
      </div>
      {/* =====/ 검색바 영역 ===== */}

      {/* ===== 하단 시트 ===== */}
      <Resizable
        className="mapPage-bottomSheet"
        defaultSize={{
          width: "100%",
          height: "15vh",
        }}
        size={{
          width: "100%",
          height: `${resizeHeight}vh`,
        }}
        maxHeight="75vh"
        minHeight="15vh"
        onResize={(e, direction, ref) => {
          const px = parseFloat(ref.style.height || "0");
          const vh = (px / window.innerHeight) * 100;
          if (!isDetailOpen) {
            setShowGpsButtons(vh <= 7.7);
          }
        }}
        onResizeStop={(e, direction, ref) => {
          let px;
          if (ref.style.height.endsWith("vh")) {
            px = (parseFloat(ref.style.height) / 100) * window.innerHeight;
          } else {
            px = parseFloat(ref.style.height || "0");
          }
          const vh = (px / window.innerHeight) * 100;
          setResizeHeight(Number(vh.toFixed(3)));
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
          top: <div className="mapPage-bottomSheetBar" />,
        }}>
        <div className="mapPage-bottomSheetContent">
          {showGpsButtons && (
            <div className="mapPage-mapButtons">
              <button type="button" onClick={() => nav("/report")}>
                <ReportIcon />
              </button>
              <button type="button" onClick={handleGpsButtonClick}>
                <GpsIcon />
              </button>
            </div>
          )}

          {/* 데이터 리스트 */}
          {Object.keys(selectData).length === 0 && (
            <>
              <div className="mapPage-filterList">
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`mapPage-filterItem${filters[key] ? " mapPage-filterItem--active" : ""}`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }>
                    {label}
                  </button>
                ))}
              </div>

              <div className="mapPage-list scroll">
                {data?.map((item, idx) => (
                  <div key={idx} className="mapPage-list-item" onClick={() => onClickListItem(item)}>
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
                        <span>{Math.round(distance({ lat: userLocation.lat, lng: userLocation.lng }, { lat: item.lat, lng: item.lng }))}m</span>
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

          {/* 공개 데이터 상세 */}
          {selectData.sourceType === "PUBLIC" && (
            <div className="mapPage-public-detail">
              <div>
                <p className="sub-title-2">{selectData.title}</p>
              </div>
              <p className="body-3">{selectData.filterType}</p>
              <p className="body-2">
                {selectData.location}
                <span onClick={() => navigator.clipboard.writeText(selectData.location)}>복사</span>
              </p>
            </div>
          )}

          {/* 제보 상세 */}
          {selectData.report && (
            <div className="mapPage-public-detail scroll">
              <div className="mapPage-public-detail-title">
                <div>
                  <p className="sub-title-2">{selectData.report.title}</p>
                  <MapSeverity severity={selectData.aiAnalysis.severityLevel} />
                </div>
                <p className="body-3">이웃 제보</p>
                <p className="body-2">
                  {selectData.report.lotAddress}
                  <span onClick={() => navigator.clipboard.writeText(selectData.report.lotAddress)}>복사</span>
                </p>
              </div>

              <div
                className="mapPage-public-image"
                style={{
                  backgroundImage: `url(${selectData.report.imageUrl || ""})`,
                }}
              />

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

      {/* 지도 */}
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </section>
  );
};

export default MapPage;
