import { useState } from "react";
import SearchBar from "../../../component/SearchBar/SearchBar";
import PlaceList from "../../../component/SearchBar/PlaceList";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportSearchPage.css";
import { useNavigate } from "react-router-dom";

export default function ReportSearchPage() {
  const [places, setPlaces] = useState([]);
  const nav = useNavigate();

  return (
    <div>
      <NavigationBar title="" />
      <div className="search-page">
        <SearchBar setPlaces={setPlaces} />
        <PlaceList
          places={places}
          onSelect={(place) => {
            nav("/report-map", { state: { selectedPlace: place } });
          }}
        />
      </div>
    </div>
  );
}
