import { useState } from "react";
import SearchBar from "../../../component/SearchBar/SearchBar";
import PlaceList from "../../../component/SearchBar/PlaceList";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../../report-search/ui/ReportSearchPage.css";
import { useLocation } from "react-router-dom";

export default function MapSearchPage() {
  const [places, setPlaces] = useState([]);
  const location = useLocation();
  const prevTitle = location.state?.prevTitle || "";

  // 장소 선택 시 localStorage에 저장 후 /map으로 이동
  const handleSelectPlace = (place) => {
    if (!place) return;
    // place 객체에 lat, lng, title(검색어) 등이 있다고 가정
    localStorage.setItem(
      "mapSearch",
      JSON.stringify({
        lat: place.lat,
        lng: place.lng,
        search: place.title || prevTitle || "",
      })
    );
    window.location.href = "/map";
  };

  return (
    <div>
      <NavigationBar title="" />
      <div className="search-page">
        <SearchBar setPlaces={setPlaces} />
        <PlaceList places={places} mode="map" prevTitle={prevTitle} onSelect={handleSelectPlace} />
      </div>
    </div>
  );
}
