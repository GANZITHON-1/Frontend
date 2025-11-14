import gpsicon from "../../assets/icons/gps.png";
import gpsiconBold from "../../assets/icons/gps-bold.png";
import "./_index.css";

/**
 * GPS 버튼 컴포넌트
 */
const GpsIcon = ({ active }) => {
  return (
    <div
      className="iconsStyleClass flexCenter"
      style={{
        backgroundColor: "var(--white)",
      }}>
      <div
        style={{
          backgroundImage: `url(${active ? gpsiconBold : gpsicon})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default GpsIcon;
