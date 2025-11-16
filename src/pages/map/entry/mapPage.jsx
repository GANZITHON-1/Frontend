import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../ui/mapPage.css";
import { Resizable } from "re-resizable";
import { useLocation, useNavigate } from "react-router-dom";
import ReportIcon from "../../../component/icons/reportIcon";
import GpsIcon from "../../../component/icons/gpsIcon";
import gps_move from "../../../assets/map/gps_move.png";
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
  { key: "police", label: "치안 민원" },
  { key: "cctv", label: "CCTV" },
  { key: "traffic", label: "교통사고" },
  { key: "bell", label: "비상벨" },
];

const MapPage = () => {
  const location = useLocation().state;
  // 지도 레벨에 따른 대략적인 반경(km) 반환
  /**
   * 지도 레벨에 따라 대략적인 반경(km)을 반환한다.
   */
  const getApproxMapRadiusKm = () => {
    if (!mapRef.current) return 2;
    const level = mapRef.current.getLevel();
    const levelToRadius = {
      3: 2,
      4: 4,
      5: 8,
      6: 16,
      7: 32,
    };
    return levelToRadius[level] || 2;
  };
  const nav = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);
  const [data, setData] = useState([]);
  const [place, setPlace] = useState("");

  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
    heading: null,
  });
  const [showGpsButtons, setShowGpsButtons] = useState(true);
  const distance = useDistance();
  const [resizeHeight, setResizeHeight] = useState(15.0);

  // 데이터 선택시
  const [selectData, setSelectData] = useState({});

  const [filters, setFilters] = useState(() =>
    FILTER_OPTIONS.reduce((acc, { key }) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const activeFilterKeys = useMemo(() => Object.keys(filters).filter((key) => filters[key]), [filters]);

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

  /**
   * 지도 중심을 지정한 좌표로 이동시킨다.
   */
  const moveMapCenter = useCallback((lat, lng) => {
    if (!mapRef.current || !window.kakao?.maps) {
      return;
    }
    const nextCenter = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(nextCenter);
  }, []);

  /**
   * 사용자 위치 마커를 지도에 표시한다. heading 값이 있으면 마커를 회전시킨다.
   */
  const updateUserMarker = useCallback((lat, lng, heading, tracking = false) => {
    if (!mapRef.current || !window.kakao?.maps) {
      return;
    }
    if (typeof lat !== "number" || typeof lng !== "number") {
      return;
    }

    const position = new window.kakao.maps.LatLng(lat, lng);
    const hasHeading = typeof heading === "number" && !Number.isNaN(heading);

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
    markerRef.current.overlay.setMap(mapRef.current);

    markerRef.current.img.src = tracking ? gps_move : gps_stop;
    markerRef.current.container.style.transform = hasHeading ? `translate(-50%, -50%) rotate(${heading}deg)` : "translate(-50%, -50%)";
  }, []);

  /**
   * 현재 위치로 지도 중심을 이동시키고, 사용자 위치 마커를 표시한다.
   */
  const moveToCurrentLocation = useCallback(async () => {
    const allowed = await checkGeolocationPermission();
    if (!allowed) {
      alert("위치 권한이 없어 위치 정보를 표시할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setUserLocation({ lat: latitude, lng: longitude, heading: null });
        moveMapCenter(latitude, longitude);
        updateUserMarker(latitude, longitude, null, false);
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, [checkGeolocationPermission, moveMapCenter, updateUserMarker]);

  /**
   * 위치 추적을 중지한다.
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current === null) {
      return;
    }
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;

    if (userLocation.lat !== null && userLocation.lng !== null) {
      updateUserMarker(userLocation.lat, userLocation.lng, null, false);
    }
  }, [updateUserMarker, userLocation.lat, userLocation.lng]);

  /**
   * 위치 추적을 시작한다. 실시간으로 위치를 업데이트한다.
   */
  const startTracking = useCallback(async () => {
    const allowed = await checkGeolocationPermission();
    if (!allowed) {
      alert("위치 권한이 없어 실시간 위치 추적을 사용할 수 없습니다.");
      return false;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const { latitude, longitude, heading } = coords;
        setUserLocation({ lat: latitude, lng: longitude, heading });
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

  /**
   * 위치 추적 토글(켜기/끄기) 기능을 수행한다.
   */
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

  /**
   * 필터 버튼을 토글한다.
   */
  const handleFilterToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /**
   * 지도와 위치 정보를 초기화한다. location 값이 있으면 해당 위치로 이동한다.
   */
  useEffect(() => {
    if (!window.kakao?.maps) {
      return;
    }
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    mapRef.current = new window.kakao.maps.Map(container, options);
    if (location && location.lat && location.lng) {
      setUserLocation({ lat: location.lat, lng: location.lng, heading: null });
      setPlace(location.search || "");
      moveMapCenter(location.location.lat, location.location.lng);
      return;
    }

    moveToCurrentLocation();
  }, [moveToCurrentLocation]);

  /**
   * 지도에 마커를 생성하고, 데이터를 조회한다. location 값이 있으면 ping 마커를 마지막에 생성한다.
   */
  useEffect(() => {
    if (userLocation.lat === null || userLocation.lng === null) {
      return;
    }

    const fetchData = async () => {
      const radius = getApproxMapRadiusKm();
      // const response = demoData;
      // TEST: 데모 데이터
      const response = await apiGetMapPageDataByFilter({
        filters: activeFilterKeys,
        lat: Number(userLocation.lat) || 0,
        lng: Number(userLocation.lng) || 0,
        radius,
      });
      setData(response || []);

      // 기존 마커 및 클러스터 초기화 (중복 방지)
      if (window._clusterer) {
        window._clusterer.clear();
      }
      if (window._markers && Array.isArray(window._markers)) {
        window._markers.forEach((marker) => marker.setMap(null));
      }
      window._markers = [];
      if (window._pingMarker) {
        window._pingMarker.setMap(null);
        window._pingMarker = null;
      }

      // filterType별 아이콘 매핑
      const iconMap = {
        user: reportIcon,
        police: detalIcon,
        traffic: carIcon,
        cctv: cctvIcon,
        bell: bellIcon,
      };

      // 마커 및 클러스터러 생성 (카카오 Marker/MarkerClusterer 사용)
      if (mapRef.current && window.kakao?.maps && Array.isArray(response)) {
        if (!window._clusterer) {
          window._clusterer = new window.kakao.maps.MarkerClusterer({
            map: mapRef.current,
            averageCenter: true,
            minLevel: 6,
            gridSize: 40,
          });
        }

        const markers = response
          .filter((item) => typeof item.lat === "number" && typeof item.lng === "number")
          .map((item) => {
            const iconSrc = iconMap[item.filterType?.toLowerCase()] || reportIcon;
            const markerImage = new window.kakao.maps.MarkerImage(iconSrc, new window.kakao.maps.Size(24, 24), {
              offset: new window.kakao.maps.Point(12, 24),
            });
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(item.lat, item.lng),
              image: markerImage,
            });
            window.kakao.maps.event.addListener(marker, "click", () => onClickListItem(item));
            return marker;
          });

        window._clusterer.addMarkers(markers);
        window._markers = markers;

        if (location && location.lat && location.lng) {
          const pingMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(location.lat, location.lng),
            image: new window.kakao.maps.MarkerImage(pingIcon, new window.kakao.maps.Size(32, 32), {
              offset: new window.kakao.maps.Point(16, 32),
            }),
            zIndex: 1000,
          });
          pingMarker.setMap(mapRef.current);
          window._pingMarker = pingMarker;
        }
      }
    };
    fetchData();
  }, [activeFilterKeys, userLocation.lat, userLocation.lng]);

  /**
   * 리스트 아이템 클릭 시 상세 데이터를 조회한다.
   */
  const onClickListItem = (item) => {
    if (item && item.sourceType === "USER") {
      const detail = apiGetMapPageUserData(item.markerId);

      return setSelectData(detail);
    } else if (item && item.sourceType === "PUBLIC") {
      const detail = apiGetMapPagePublicData(item.markerId);
      setResizeHeight(15.0);
      setShowGpsButtons(true);
      return setSelectData(detail);
    }
    //TEST: 데모 데이터
    // setSelectData(demoDetailData);
    // setResizeHeight(15.0);
    // setShowGpsButtons(true);
    // console.log("선택");
  };

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
      {/* ===== 하단 시트 영역 ===== */}
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
          // 높이에 따른 버튼 박스 노출 제어
          const px = parseFloat(ref.style.height);
          const vh = (px / window.innerHeight) * 100;
          setShowGpsButtons(vh <= 7.7);
        }}
        onResizeStop={(e, direction, ref) => {
          let px;
          if (ref.style.height.endsWith("vh")) {
            px = (parseFloat(ref.style.height) / 100) * window.innerHeight;
          } else {
            px = parseFloat(ref.style.height);
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
        {/* ===== 하단 시트 내용 ===== */}
        <div className="mapPage-bottomSheetContent">
          {showGpsButtons && (
            <div className="mapPage-mapButtons">
              <button
                type="button"
                onClick={() => {
                  nav("/report");
                }}>
                <ReportIcon />
              </button>
              <button type="button" onClick={toggleTracking}>
                <GpsIcon active={isTracking} />
              </button>
            </div>
          )}

          {/* ===== 데이터 리스트 영역 ===== */}
          {Object.keys(selectData).length === 0 && (
            <div>
              {/* 필터 리스트 */}
              <div className="mapPage-filterList ">
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    type="button"
                    key={key}
                    className={`mapPage-filterItem${filters[key] ? " mapPage-filterItem--active" : ""}`}
                    onClick={() => handleFilterToggle(key)}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ===== 목록 리스트 영역 ===== */}
              <div className="mapPage-list scroll">
                {data &&
                  data?.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="mapPage-list-item"
                        onClick={() => {
                          onClickListItem(item);
                        }}>
                        {/* 아이콘 */}
                        <div className="mapPage-list-item-icon">
                          {item.filterType?.toLowerCase() === "user" && <ReportIcon />}
                          {item.filterType?.toLowerCase() === "police" && <DetalIcon />}
                          {item.filterType?.toLowerCase() === "cctv" && <CctvIcon />}
                          {item.filterType?.toLowerCase() === "traffic" && <CarIcon />}
                          {item.filterType?.toLowerCase() === "bell" && <BellIcon />}
                        </div>
                        <div className="mapPage-list-item-content">
                          {/* title */}
                          <p className="sub-title-3">{item.title}</p>
                          {/* sub */}
                          <div className="body-2">
                            {/* 거리차이 */}
                            <span>
                              {Math.round(
                                distance(
                                  {
                                    lat: userLocation.lat,
                                    lng: userLocation.lng,
                                  },
                                  { lat: item.lat, lng: item.lng }
                                )
                              )}
                              m
                            </span>
                            <div className="mapPage-dot">{/* 중앙 점 */}</div>
                            {/* 주소 */}
                            <span>{item.location || "주소 정보 없음"}</span>
                          </div>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                      </div>
                    );
                  })}
              </div>
              {/* =====/ 목록 리스트 영역 ===== */}
            </div>
          )}
          {/* =====/ 데이터 리스트 영역 ===== */}

          {/* ===== 공개데이터 상세 영역 ===== */}
          {Object.keys(selectData).length !== 0 && selectData.sourceType && selectData.sourceType === "PUBLIC" && (
            <div className="mapPage-public-detail">
              <div>
                <p className="sub-title-2">{selectData.title}</p>
                <MapSeverity severity={selectData.severity} />
              </div>
              <p className="body-3">{selectData.filterType}</p>
              <p className="body-2">
                {selectData.location}
                <span
                  onClick={() => {
                    if (selectData.location) {
                      navigator.clipboard.writeText(selectData.location);
                    }
                  }}>
                  복사
                </span>
              </p>
            </div>
          )}
          {/* =====/ 공개데이터 상세 영역 ===== */}

          {/* ===== 제보데이터 상세 영역 ===== */}
          {Object.keys(selectData).length !== 0 && !selectData.sourceType && (
            <div className="mapPage-public-detail scroll">
              <div className="mapPage-public-detail-title">
                <div>
                  <p className="sub-title-2">{selectData.report.title}</p>
                  <MapSeverity severity={selectData.aiAnalysis.severityLevel} />
                </div>
                <p className="body-3">이웃 제보</p>
                <p className="body-2">
                  {selectData.report.lotAddress}
                  <span
                    onClick={() => {
                      if (selectData.report.lotAddress) {
                        navigator.clipboard.writeText(selectData.report.lotAddress);
                      }
                    }}>
                    복사
                  </span>
                </p>
              </div>

              <div className="mapPage-public-image">{/* 이미지 */}</div>

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
          {/* =====/ 제보데이터 상세 영역 ===== */}
        </div>
        {/* =====/ 하단 시트 내용 ===== */}
      </Resizable>
      {/* =====/ 하단 시트 영역 ===== */}

      {/* ===== 지도 영역 ===== */}
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {/* =====/ 지도 영역 ===== */}
    </section>
  );
};

export default MapPage;
