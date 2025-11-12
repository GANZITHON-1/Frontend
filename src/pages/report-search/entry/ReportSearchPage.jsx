import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../component/SearchBar/SearchBar";
import PlaceList from "../../../component/SearchBar/PlaceList";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportSearchPage.css";
import { useGeocder } from "../../../hook/useGeocder.js"; // 커스텀 훅 import

export default function ReportSearchPage() {
  const [places, setPlaces] = useState([]); // 검색 결과 리스트
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소
  const navigate = useNavigate();
  const { addressToCoord } = useGeocder();

  // 장소 클릭 시 → 좌표 변환 후 /report로 navigate
  const handleSelectPlace = async (place) => {
    try {
      setSelectedPlace(place);

      // 주소 → 좌표 변환 (도로명 우선)
      const queryAddress = place.road_address_name || place.address_name;
      const coord = await addressToCoord(queryAddress);
      const lat = parseFloat(coord.y);
      const lng = parseFloat(coord.x);

      // /report 페이지로 주소 + 좌표 전달
      navigate("/report", {
        state: {
          selectedAddress: {
            roadAddress: place.road_address_name || "",
            lotAddress: place.address_name || "",
            lat,
            lng,
          },
        },
      });
    } catch (err) {
      console.error("좌표 변환 실패:", err);
      alert("좌표를 불러오는 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <NavigationBar title="" />
      <div className="place-page">
        {/* 검색창 */}
        <SearchBar setPlaces={setPlaces} />

        {/* 장소 리스트 */}
        <PlaceList places={places} onSelect={handleSelectPlace} />

        {/* 선택된 장소 → 맵 표시 (필요 시 해제 주석 제거)*/}
        {selectedPlace && <MapContainer place={selectedPlace} />}
      </div>
    </div>
  );
}
