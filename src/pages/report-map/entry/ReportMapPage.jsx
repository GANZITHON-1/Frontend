import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ui/ReportMapPage.css";
import { useGeocoder } from "../../../hook/useGeocoder";
import pingIcon from "../../../assets/map/marker/ping.svg";

export default function ReportMapPage() {
  const location = useLocation();
  const state = location.state;
  const selectedPlace = state?.place;

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { addressToCoord } = useGeocoder();
  const nav = useNavigate();

  const [coord, setCoord] = useState(null);

  // 1) 주소 → 좌표 변환
  useEffect(() => {
    if (!selectedPlace) return;

    (async () => {
      try {
        const result = await addressToCoord(selectedPlace.address_name);
        const lat = Number(result.y);
        const lng = Number(result.x);
        setCoord({ lat, lng });
      } catch (e) {
        console.error("주소 변환 실패:", e);
      }
    })();
  }, [selectedPlace]);

  // 2) 지도는 "최초 1회만" 생성
  useEffect(() => {
    if (!window.kakao?.maps) return;

    const container = document.getElementById("report-map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 초기 기본 위치
      level: 3,
    };

    mapRef.current = new window.kakao.maps.Map(container, options);

    // 마커 생성 (최초 1회)
    const markerImg = new window.kakao.maps.MarkerImage(
      pingIcon,
      new window.kakao.maps.Size(36, 36)
    );

    markerRef.current = new window.kakao.maps.Marker({
      position: mapRef.current.getCenter(),
      image: markerImg,
    });

    markerRef.current.setMap(mapRef.current);
  }, []); // ★ 최초 1회만 실행

  // 3) 좌표가 변경되면 지도 중심만 이동시키기
  useEffect(() => {
    if (!coord || !mapRef.current || !markerRef.current) return;

    const newCenter = new window.kakao.maps.LatLng(coord.lat, coord.lng);

    // 지도 중점 이동만
    mapRef.current.setCenter(newCenter);

    // 마커만 이동
    markerRef.current.setPosition(newCenter);
  }, [coord]); // 지도 재생성 없음

  const handleSelect = () =>
    nav("/report", {
      state: {
        selectedAddress: {
          roadAddress: selectedPlace.address_name,
          lotAddress: selectedPlace.address_name,
          lat: coord.lat,
          lng: coord.lng,
        },
        prevTitle: location.state?.prevTitle,
      },
    });

  return (
    <section className="reportMapPage">
      <div id="report-map" className="reportMapPage-map"></div>

      {selectedPlace && (
        <div className="reportMapPage-bottomSheet">
          <p className="reportMapPage-title">{selectedPlace.place_name}</p>
          <p className="reportMapPage-address">{selectedPlace.address_name}</p>

          <button className="reportMapPage-selectBtn" onClick={handleSelect}>
            선택하기
          </button>
        </div>
      )}
    </section>
  );
}
