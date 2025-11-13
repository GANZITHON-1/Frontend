import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ui/ReportMapPage.css";
import { useGeocoder } from "../../../hook/useGeocoder";
import pingIcon from "../../../assets/map/marker/ping.svg";

export default function ReportMapPage() {
  const { state } = useLocation();
  const selectedPlace = state?.place;

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const { addressToCoord } = useGeocoder();
  const nav = useNavigate();

  const [coord, setCoord] = useState(null);

  // ================ 주소를 좌표로 변환 후 상태 저장 ================
  useEffect(() => {
    if (!selectedPlace) return;

    async function convert() {
      try {
        const result = await addressToCoord(selectedPlace.address_name);
        const lat = Number(result.y);
        const lng = Number(result.x);

        setCoord({ lat, lng });
      } catch (e) {
        console.error("주소 변환 실패:", e);
      }
    }

    convert();
  }, [selectedPlace, addressToCoord]);

  // ================ 지도 생성 및 핑 표시 ================
  useEffect(() => {
    if (!coord || !window.kakao?.maps) return;

    const container = document.getElementById("report-map");
    const options = {
      center: new window.kakao.maps.LatLng(coord.lat, coord.lng),
      level: 3,
    };

    // 지도 생성
    mapRef.current = new window.kakao.maps.Map(container, options);

    // 기존 마커 제거
    if (markerRef.current) markerRef.current.setMap(null);

    // 핑 마커 생성
    const markerImg = new window.kakao.maps.MarkerImage(
      pingIcon,
      new window.kakao.maps.Size(36, 36)
    );

    markerRef.current = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(coord.lat, coord.lng),
      image: markerImg,
    });

    markerRef.current.setMap(mapRef.current);
  }, [coord]);

  const handleSelect = () => {
    nav("/report", {
      state: {
        address: selectedPlace.address_name,
        name: selectedPlace.place_name,
      },
    });
  };

  return (
    <section className="reportMapPage">
      {/* 지도 전체화면 */}
      <div id="report-map" className="reportMapPage-map"></div>

      {/* 장소 정보 바텀 시트 */}
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
