import carIcon from "../../assets/icons/car.png";
import "./_index.css";

const CarIcon = () => {
  return (
    <div
      className="iconsStyleClass"
      style={{
        backgroundColor: "var(--cyan)",
      }}>
      <div
        style={{
          backgroundImage: `url(${carIcon})`,
        }}>
        {/* icon */}
      </div>
    </div>
  );
};
export default CarIcon;
