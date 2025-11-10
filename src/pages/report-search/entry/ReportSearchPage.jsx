import { useState } from "react";
import SearchBar from "../../../component/SearchBar/SearchBar";
import PlaceList from "../../../component/SearchBar/PlaceList";
// import MapContainer from "../components/MapContainer";
import "../ui/ReportSearchPage.css";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";

export default function ReportSearchPage() {
  const [places, setPlaces] = useState([]); // 검색 결과
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소

  return (
    <div>
      <NavigationBar title="" />
      <div className="place-page">
        <SearchBar setPlaces={setPlaces} />
        <PlaceList places={places} onSelect={setSelectedPlace} />
        {selectedPlace && <MapContainer place={selectedPlace} />}
      </div>
    </div>
  );
}
