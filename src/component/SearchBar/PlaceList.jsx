import "../../pages/report-search/ui/ReportSearchPage.css";
import { useNavigate } from "react-router-dom";

export default function PlaceList({ places, mode, prevTitle }) {
  const nav = useNavigate();

  const handleClick = (place) => {
    if (mode === "report") {
      nav("/report-map", {
        state: { place, prevTitle },
      });
      return;
    }

    if (mode === "map") {
      nav("/map", {
        state: {
          lat: Number(place.y),
          lng: Number(place.x),
          search: place.place_name,
        },
      });
      return;
    }

    console.warn("PlaceList: 잘못된 mode 값입니다.", mode);
  };

  return (
    <div className="place-list">
      {places.map((p, idx) => (
        <div key={idx} className="place-item" onClick={() => handleClick(p)}>
          <p className="place-title">{p.place_name}</p>
          <p className="place-address">{p.address_name}</p>
        </div>
      ))}
    </div>
  );
}
