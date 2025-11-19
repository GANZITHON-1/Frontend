import "../../pages/report-search/ui/ReportSearchPage.css";

import { useNavigate } from "react-router-dom";

export default function PlaceList({ places, prevTitle }) {
  const nav = useNavigate();

  return (
    <div className="place-list">
      {places.map((p, idx) => (
        <div
          key={idx}
          className="place-item"
          onClick={() => {
            nav("/report-map", { state: { place: p, prevTitle: prevTitle } });
          }}
        >
          <p className="place-title">{p.place_name}</p>
          <p className="place-address">{p.address_name}</p>
        </div>
      ))}
    </div>
  );
}
