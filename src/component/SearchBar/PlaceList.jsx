import "../../pages/report-search/ui/ReportSearchPage.css";

export default function PlaceList({ places, onSelect }) {
  if (!places.length) return null;

  return (
    <div className="place-list">
      {places.map((p) => (
        <div key={p.id} className="place-item" onClick={() => onSelect(p)}>
          <h4>{p.place_name}</h4>
          <p className="category">{p.category_group_name}</p>
          <p className="address">{p.road_address_name || p.address_name}</p>
        </div>
      ))}
    </div>
  );
}
