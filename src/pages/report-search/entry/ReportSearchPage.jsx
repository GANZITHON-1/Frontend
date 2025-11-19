import { useState } from "react";
import SearchBar from "../../../component/SearchBar/SearchBar";
import PlaceList from "../../../component/SearchBar/PlaceList";
import NavigationBar from "../../../component/NavigationBar/NavigationBar";
import "../ui/ReportSearchPage.css";
import { useLocation } from "react-router-dom";

export default function ReportSearchPage() {
  const [places, setPlaces] = useState([]);
  const location = useLocation();

  return (
    <div>
      <NavigationBar title="" />
      <div className="search-page">
        <SearchBar setPlaces={setPlaces} />

        <PlaceList
          places={places}
          prevTitle={location.state?.prevTitle} // 여기 추가해야 제목이 유지됨
        />
      </div>
    </div>
  );
}
