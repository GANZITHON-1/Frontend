import cctvIcon from "../../assets/icons/cctv.png";
import "./_index.css";

const CctvIcon = () => {
  return (
    <div
      className="iconsStyleClass flexCenter"
      style={{
        backgroundColor: "var(--green-200)",
      }}>
      <div
        style={{
          backgroundImage: `url(${cctvIcon})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default CctvIcon;
