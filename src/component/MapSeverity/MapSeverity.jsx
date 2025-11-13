import "./MapSeverity.css";

const MapSeverity = ({ severity }) => {
  return <div className={`mapPage-severity sub-title-4 ${severity === "안전" ? "safety" : severity === "주의" ? "caution" : "danger"}`}>{severity}</div>;
};
export default MapSeverity;
