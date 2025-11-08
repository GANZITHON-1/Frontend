import detalIcon from "../../assets/icons/detal.png";
import "./_index.css";

const DetalIcon = () => {
  return (
    <div
      className="iconsStyleClass flexCenter"
      style={{
        backgroundColor: "var(--red-200)",
      }}>
      <div
        style={{
          backgroundImage: `url(${detalIcon})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default DetalIcon;
